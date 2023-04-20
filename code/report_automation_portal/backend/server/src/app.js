import * as dotenv from 'dotenv';
import session from 'express-session';
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import validatePass from './auth/validatePass.js';
import chkCleanFile from './reportProc/chkCleanFile.js';
import { sessionStore } from '../middleware/database.js';
import classifyOperation from './reportProc/classifyOperation.js';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const fileDate = new Date();
    cb(
      null,
      `report_${fileDate.getDate()}-${
        fileDate.getMonth() + 1
      }-${fileDate.getFullYear()}_${Math.round(Math.random())}.xlsx`
    );
  },
});
const upload = multer({ storage });

dotenv.config();

const makeApp = async (userFunc, reportFunc) => {
  const app = express();
  app.use(express.json());
  app.use(
    cors({
      origin: 'http://localhost:3000',
      methods: 'GET,PUT,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    })
  );

  app.use(
    session({
      key: process.env.SESSION_KEY,
      secret: process.env.SESSION_SECRET,
      store: sessionStore,
      resave: true,
      saveUninitialized: false,
    })
  );

  app.use((req, res, next) => {
    req.session.init = 'init';
    next();
  });

  app.post(
    '/users/login-user',
    express.urlencoded({ extended: false }),
    async (req, res, next) => {
      let passHash;
      try {
        passHash = await userFunc.getPassHash(req.body.username);
      } catch (err) {
        console.error('Hashing password failed', err);
      }
      if (passHash === undefined) {
        // User may not exist or typo in username
        console.log(
          `The user ${req.body.username} being queried doesn't exist.`
        );
        res
          .status(404)
          .send({ message: 'Username incorrect. Please check the username.' });
        // res.redirect("/")
        // return;
      }

      let validPass;
      try {
        validPass = await validatePass(req.body.password, passHash);
      } catch (err) {
        console.error('Validating password failed', err);
      }
      if (validPass) {
        req.session.regenerate(async (err) => {
          if (err) next(err);
          req.session.validSession = true;
          req.session.user = req.body.username;
          try {
            req.session.utype = await userFunc.getUserType(req.body.username);
          } catch (error) {
            console.error('Could not get user type for session', error);
          }
          req.session.save(() => {
            if (err) return next(err);
            // res.redirect("/Dashboard")
            return undefined;
          });
        });
        res.status(200).json({ message: 'Yay! Logged in.' });
      } else {
        req.session.validSession = false;
        res.status(401).json({ message: 'Oh no. Wrong password' });
        // res.redirect("/Login")
      }
    }
  );

  app.post('/users/add-user', async (req, res) => {
    let addSts = 400;
    let addMesg = { '': '' };

    let userExist;
    try {
      userExist = await userFunc.checkUserExists(req.body.username);
    } catch (err) {
      console.error('Could not fetch user existence.', err);
    }
    if (userExist) {
      addMesg = { message: 'User already exists.' };
    } else if (
      !req.body.username ||
      !req.body.password ||
      !req.body.usertype ||
      !req.body.userrole
    ) {
      addMesg = {
        message: 'User details insufficient, please check all the fields.',
      };
    } else if (!userFunc.chkPassStrngth(req.body.password, 1)) {
      addMesg = {
        message:
          'Password strength criterion not fulfilled. Please add Symbols, Upper and lower case letters.',
      };
    } else {
      try {
        [addSts, addMesg] = await userFunc.addUser(
          req.body.username,
          req.body.password,
          req.body.usertype,
          req.body.userrole
        );
      } catch (err) {
        console.error('Could not add the user', err);
      }
    }
    res.status(addSts).json(addMesg);
  });

  app.get('/users/details-user', async (req, res) => {
    let detailsSts = 404;
    let detailsMesg = { '': '' };

    let userExist;
    try {
      userExist = await userFunc.checkUserExists(req.body.username);
    } catch (err) {
      console.error('Could not fetch user existence.', err);
    }
    if (!userExist) {
      detailsMesg = { message: 'User does not exist.' };
      res.status(detailsSts).json(detailsMesg);
    }
    let isAdmin;
    try {
      isAdmin = userFunc.chkAdmin(req.session.user);
    } catch (err) {
      console.error('Could not check if user admin or not.', err);
    }
    if (isAdmin) {
      // if (userFunc.chkAdmin(req.body.username)) {
      [detailsSts, detailsMesg] = await userFunc.getUserDetails(
        req.body.username
      );
    } else {
      detailsMesg = { message: 'Could not perform operation' };
    }
    res.status(detailsSts).json(detailsMesg);
  });

  app.put('/users/modify-user', async (req, res) => {
    // Also check for admin having same username as req
    let updtSts = 404;
    let updtMesg = { '': '' };
    let userExist;
    try {
      userExist = await userFunc.checkUserExists(req.body.username);
    } catch (err) {
      console.error('Could not fetch user existence.', err);
    }
    if (!userExist) {
      updtMesg = { message: 'User does not exist.' };
      // res.status(updtSts).json(updtMesg);
    }
    let isAdmin;
    try {
      await userFunc.chkAdmin(req.session.user);
    } catch (err) {
      console.error('Could not check if user is admin or not.', err);
    }

    if (isAdmin) {
      // else if (await userFunc.chkAdmin(req.body.username)) {
      isAdmin = await userFunc.chkAdmin(req.body.username);
      if (req.body.username !== req.session.user && !isAdmin) {
        try {
          [updtSts, updtMesg] = await userFunc.modUserByAdmin(
            req.body.username,
            req.body.password,
            req.body.usertype,
            req.body.userrole
          );
        } catch (err) {
          console.error('Could not update user by admin.', err);
        }
      } else {
        updtMesg = { message: 'The change to other user is not allowed.' };
      }
      if (
        req.body.username === req.session.user &&
        req.session.utype.toLowerCase() === 'regular'
      ) {
        /*  } else if (
      (await userFunc.getUserType(req.body.username)).toLowerCase() ===
      'regular'
      ) { */
        try {
          [updtSts, updtMesg] = await userFunc.modUserByRegular(
            req.body.username,
            req.body.password
          );
        } catch (err) {
          console.error('Could not update user by regular user.', err);
        }
      } else {
        updtMesg = { message: 'Could not perform operation' };
      }
      res.status(updtSts).json(updtMesg);
    }
  });

  app.delete('/users/delete-user', async (req, res) => {
    let delSts = 404;
    let delMesg = { '': '' };
    let userExist;
    try {
      userExist = await userFunc.checkUserExists(req.body.username);
    } catch (err) {
      console.error('Could not check existence of user.', err);
    }
    if (!userExist) {
      delMesg = { message: 'User does not exist.' };
    } else if (req.session.utype) {
      // else if (await userFunc.chkAdmin(req.body.username)) {
      try {
        [delSts, delMesg] = await userFunc.deleteUser(req.body.username);
      } catch (err) {
        console.error('Could not delete the user.', err);
      }
    } else {
      delMesg = { message: 'Could not perform operation' };
    }
    res.status(delSts).json(delMesg);
  });

  app.get('/users/logout', async (req, res, next) => {
    req.session.username = null;
    req.session.save((err) => {
      if (err) next(err);
      req.session.regenerate(() => {
        if (err) next(err);
        res.redirect('/');
      });
    });
  });

  app.post(
    '/reports/upload-report',
    upload.single('xlsx'),
    async (req, res) => {
      let upldSts = 400;
      let upldMesg = { '': '' };
      let resCleanFile;
      try {
        resCleanFile = await chkCleanFile(req.file);
      } catch (err) {
        console.error('Could not check if file is clean.', err);
      }
      if (resCleanFile === 1) {
        upldSts = 400;
        upldMesg = {
          message:
            'The file format is not Microsoft Excel (.xlsx).\n Please check the file',
        };
      } else if (resCleanFile === 2) {
        upldSts = 400;
        upldMesg = {
          mesage: `The file ${req.file.originalname} is infected please check the file.`,
        };
      } else {
        /* const tempDate = new Date().toISOString();
        const tempDate2 = new Date(tempDate);
        const mySQLDateString = tempDate2
          .toJSON()
          .slice(0, 19)
          .replace('T', ' '); */
        const mySQLDateString = req.body.date
          .toJSON()
          .slice(0, 19)
          .replace('T', ' ');
        let reportId;
        try {
          [upldSts, upldMesg, reportId] = await reportFunc.storeReportToServer(
            req.body.type,
            mySQLDateString,
            req.body.sessn,
            req.file.path
          );
        } catch (err) {
          console.error('Could not store the file in the server.', err);
        }
        try {
          [upldSts, upldMesg] = await classifyOperation(
            req.file,
            req.body.type,
            reportId,
            'store',
            reportFunc
          );
        } catch (err) {
          console.error(
            'Could not store the classify/store data in database.',
            err
          );
        }
      }
      console.log(upldSts, upldMesg);
      res.status(upldSts).json(upldMesg);
    }
  );

  app.get('/reports/fetch-report', async (req, res) => {
    let ftchSts = 400;
    let ftchMesg = { '': '' };
    let reportId;
    try {
      reportId = await reportFunc.getReportId(
        req.body.type,
        req.body.date,
        req.body.sessn
      );
    } catch (err) {
      console.error('Could not get reportId.', err);
    }
    let resReportExists;
    try {
      resReportExists = await reportFunc.chkReportExists(reportId);
    } catch (err) {
      console.error('Could not check existence of report.', err);
    }
    if (!resReportExists) {
      [ftchSts, ftchMesg] = [
        404,
        { message: `The report being queried does't exist.` },
      ];
    } else {
      try {
        [ftchSts, ftchMesg] = await classifyOperation(
          undefined,
          req.body.type,
          reportId,
          'fetch',
          reportFunc
        );
      } catch (err) {
        console.error(
          'Could not fetch the classify/fetch data in database.',
          err
        );
      }
    }

    res.status(ftchSts).json(ftchMesg);
  });

  app.get('/reports/generate-report', async (req, res) => {
    let genSts = 400;
    let genMesg = { '': '' };
    let reportId;

    try {
      reportId = await reportFunc.getReportId(
        req.body.type,
        req.body.date,
        req.body.sessn
      );
    } catch (err) {
      console.error('Could not get reportId.', err);
    }
    let resReportExists;
    try {
      resReportExists = await reportFunc.chkReportExists(reportId);
    } catch (err) {
      console.error('Could not check existence of report.', err);
    }
    if (resReportExists) {
      try {
        [genSts, genMesg] = await classifyOperation(
          undefined,
          req.body.type,
          reportId,
          'fetch',
          reportFunc
        );
      } catch (err) {
        console.error(
          'Could not fetch the classify/fetch data in database.',
          err
        );
      }
    } else {
      try {
        [genSts, genMesg] = await classifyOperation(
          undefined,
          req.body.type,
          reportId,
          'generate',
          reportFunc
        );
      } catch (err) {
        console.error(
          'Could not generate the classify/generate data in database.',
          err
        );
      }
    }
    res.status(genSts).json(genMesg);
  });

  app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Something broke');
    console.log('This is the rejected field ->', err.field);
    next();
  });

  return app;
};

export default makeApp;
