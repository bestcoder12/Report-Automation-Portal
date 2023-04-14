import request from 'supertest';
// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from '@jest/globals';
import makeApp from '../app.js';
import userOps from '../../middleware/db_user.js';
import testData from './appTestData';

const db = jest.fn();
const userFunc = await userOps(db);
jest.spyOn(userFunc, 'addUser');
jest.spyOn(userFunc, 'chkAdmin');
jest.spyOn(userFunc, 'getUserType');
jest.spyOn(userFunc, 'getUserDetails');
jest.spyOn(userFunc, 'getPassHash');
userFunc.addUser.mockImplementation(async (uname, passwrd, utype, urole) => {
  if (
    !!uname &&
    !!passwrd &&
    !!utype &&
    !!urole &&
    userFunc.chkPassStrngth(passwrd, 1)
  )
    return [200, { message: 'User added successfully.' }];

  return [500, { message: 'User could not be added' }];
});

userFunc.getUserType.mockImplementation(async (uname) => {
  const data = testData.corrUsers;
  let retVal;
  data.forEach((uObj) => {
    if (uname === uObj.username) retVal = uObj.usertype;
  });
  return retVal;
});

userFunc.chkAdmin.mockImplementation(
  async (uname) => (await userFunc.getUserType(uname)).toLowerCase() === 'admin'
);

userFunc.getUserDetails.mockImplementation(async (uname) => {
  const data = testData.corrAdminUsers;
  let retVal;
  data.forEach((uObj) => {
    if (uname === uObj.username) retVal = [200, uObj];
  });
  return retVal;
});

userFunc.getPassHash.mockImplementation(async (uname) => {
  const data = testData.corrPassArr;
  let retVal;
  data.forEach((uObj) => {
    if (uname === uObj.username) retVal = uObj.corrHash;
  });
  return retVal;
});

const app = await makeApp(userFunc);

describe('User addition endpoint', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call userAdd() function in the request', async () => {
    const userObj = testData.corrUsers[0];
    await request(app).post('/users/add-user').send(userObj);
    expect(userFunc.addUser).toHaveBeenCalled();
  });

  test('should call userAdd() function only once per request', async () => {
    const userObj = testData.corrUsers[0];
    await request(app).post('/users/add-user').send(userObj);
    expect(userFunc.addUser).toHaveBeenCalledTimes(1);
  });

  test('should return status code 200 for successful addition of user', async () => {
    const userInfo = testData.corrUsers;
    await Promise.all(
      userInfo.map(async (userObj) => {
        const response = await request(app)
          .post('/users/add-user')
          .send(userObj);
        expect(response.statusCode).toBe(200);
      })
    );
  });

  test('should return status code 400 for insufficient password strength', async () => {
    const userInfo = testData.insuffUserPass;

    await Promise.all(
      userInfo.map(async (userObj) => {
        const response = await request(app)
          .post('/users/add-user')
          .send(userObj);
        expect(response.statusCode).toBe(400);
      })
    );
  });

  test('should return status code 400 for errors in parameters.', async () => {
    const userInfo = testData.missUserParams;
    await Promise.all(
      userInfo.map(async (userObj) => {
        const response = await request(app)
          .post('/users/add-user')
          .send(userObj);
        expect(response.statusCode).toBe(400);
      })
    );
  });
});

describe('Get user details endpoint', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call getUserDetails() function', async () => {
    const userObj = testData.corrAdminUsers[0];
    await request(app)
      .get('/users/details-user')
      .send({ username: userObj.username });
    expect(userFunc.getUserDetails).toHaveBeenCalled();
  });

  test('should call getUserDetails() function exactly once per request', async () => {
    const userObj = testData.corrAdminUsers[0];
    await request(app)
      .get('/users/details-user')
      .send({ username: userObj.username });
    expect(userFunc.getUserDetails).toHaveBeenCalledTimes(1);
  });

  test('should return status code 200', async () => {
    const userInfo = testData.corrAdminUsers;
    await Promise.all(
      userInfo.map(async (userObj) => {
        const response = await request(app)
          .get('/users/details-user')
          .send({ username: userObj.username });
        expect(response.statusCode).toBe(200);
      })
    );
  });

  test('should return all the details of the user', async () => {
    const userInfo = testData.corrAdminUsers;
    await Promise.all(
      userInfo.map(async (userObj) => {
        const response = await request(app)
          .get('/users/details-user')
          .send({ username: userObj.username });
        expect(
          [response.text].every(
            (x) => x !== null || x !== undefined || x !== ''
          )
        ).toBe(true);
      })
    );
  });
});

describe('Login user endpoint', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call the getPassHash() function', async () => {
    const userObj = testData.corrUsers[0];
    await request(app).post('/users/login-user').send({
      username: userObj.username,
      password: userObj.password,
    });
    expect(userFunc.getPassHash).toHaveBeenCalled();
  });

  test('should call getPassHash() only once per request', async () => {
    const userObj = testData.corrUsers[0];
    await request(app).post('/users/login-user').send({
      username: userObj.username,
      password: userObj.password,
    });
    expect(userFunc.getPassHash).toHaveBeenCalledTimes(1);
  });

  test('should return status code 200 for valid login', async () => {
    const userInfo = testData.corrUsers;
    await Promise.all(
      userInfo.map(async (userObj) => {
        const response = await request(app)
          .post('/users/login-user')
          .send(userObj);
        expect(response.statusCode).toBe(200);
      })
    );
  });

  test('should return status code for invalid login credentials.', async () => {
    const userInfo = testData.insuffUserPass;
    await Promise.all(
      userInfo.map(async (userObj) => {
        const response = await request(app)
          .post('/users/login-user')
          .send(userObj);
        expect(response.statusCode).toBe(401);
      })
    );
  });

  test('should return status code 404 for wrong username', async () => {
    const userInfo = testData.nonExistUser;
    await Promise.all(
      userInfo.map(async (userObj) => {
        const response = await request(app)
          .post('/users/login-user')
          .send(userObj);
        expect(response.statusCode).toBe(404);
      })
    );
  });
});
