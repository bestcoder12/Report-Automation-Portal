import * as dotenv from 'dotenv';
import session from 'express-session';
import express from 'express';
import multer from 'multer';
// import * as XLSX from 'xlsx';
import validatePass from './auth/validatePass.js';
import chkCleanFile from './reportProc/chkCleanFile.js';

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
// import cors from "cors";
// import sessionStore from "../middleware/database.js"
// import bcrypt from "bcrypt";

const makeApp = async (userFunc) => {
  const app = express();
  app.use(express.json());

  app.use(
    session({
      key: process.env.SESSION_KEY,
      secret: process.env.SESSION_SECRET,
      // store: sessionStore,
      resave: true,
      saveUninitialized: false,
    })
  );

  app.post(
    '/users/login-user',
    express.urlencoded({ extended: false }),
    async (req, res, next) => {
      const passHash = await userFunc.getPassHash(req.body.username);
      if (passHash === undefined) {
        // User may not exist or typo in username
        console.log(
          `The user ${req.body.username} being queried doesn't exist.`
        );
        res
          .status(404)
          .send({ message: 'Username incorrect. Please check the username.' });
        // res.redirect("/")
        return;
      }

      const validPass = await validatePass(req.body.password, passHash);
      if (validPass) {
        req.session.regenerate((err) => {
          if (err) next(err);
          req.session.validSession = true;
          req.session.user = req.body.username;
          req.session.utype = userFunc.getUserType(req.body.username);
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

    const userExist = await userFunc.checkUserExists(req.body.username);
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
      console.log(req.body);
      [addSts, addMesg] = await userFunc.addUser(
        req.body.username,
        req.body.password,
        req.body.usertype,
        req.body.userrole
      );
    }
    res.status(addSts).json(addMesg);
  });

  app.get('/users/details-user', async (req, res) => {
    let detailsSts = 404;
    let detailsMesg = { '': '' };
    const userExist = await userFunc.checkUserExists(req.body.username);
    if (!userExist) {
      detailsMesg = { message: 'User does not exist.' };
      res.status(detailsSts).json(detailsMesg);
    }
    // if (userFunc.chkAdmin(req.session.user))
    if (userFunc.chkAdmin(req.body.username)) {
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
    const userExist = await userFunc.checkUserExists(req.body.username);
    if (!userExist) {
      updtMesg = { message: 'User does not exist.' };
      // res.status(updtSts).json(updtMesg);
    }
    // if ((await userFunc.getUserType(req.session.user)).toLowerCase() == "admin") {
    else if (await userFunc.chkAdmin(req.body.username)) {
      /*  if (
        req.body.username !== req.session.user &&
        !userFunc.chkAdmin(req.body.username)
      ) { */
      [updtSts, updtMesg] = await userFunc.modUserByAdmin(
        req.body.username,
        req.body.password,
        req.body.usertype,
        req.body.userrole
      );
      /* }
      else {
        updtMesg = { message: 'The change to other user is not allowed.' };
      } */
      // if (req.body.username === req.session.user) {
    } else if (
      (await userFunc.getUserType(req.body.username)).toLowerCase() ===
      'regular'
    ) {
      [updtSts, updtMesg] = await userFunc.modUserByRegular(
        req.body.username,
        req.body.password
      );
    } else {
      updtMesg = { message: 'Could not perform operation' };
    }
    res.status(updtSts).json(updtMesg);
  });

  app.delete('/users/delete-user', async (req, res) => {
    let delSts = 404;
    let delMesg = { '': '' };
    const userExist = await userFunc.checkUserExists(req.body.username);
    if (!userExist) {
      delMesg = { message: 'User does not exist.' };
    }
    // else if (userFunc.getUserType(req.session.user)) {
    else if (await userFunc.chkAdmin(req.body.username)) {
      [delSts, delMesg] = await userFunc.deleteUser(req.body.username);
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
      const resCleanFile = await chkCleanFile(req.file);
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
      }
      // const await uploadReportToDB(req.body.type, req.body.date, req.body.sesn);
      // storeFileToServer(req.file)
      console.log(req.file);
      res.status(upldSts).json(upldMesg);
    }
  );

  app.use((err, req, res) => {
    console.log(err);
    res.status(500).send('Something broke');
    console.log('This is the rejected field ->', err.field);
  });

  return app;
};

export default makeApp;
