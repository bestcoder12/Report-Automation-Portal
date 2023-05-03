// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from '@jest/globals';
import request from 'supertest';
import makeApp from '../app.js';
import userOps from '../../middleware/db_user.js';
import reportOps from '../reportProc/db_report.js';
import testData from './appTestData';

let dataArr;

const db = jest.fn();
const userFunc = await userOps(db);
const reportFunc = await reportOps(db);
jest.spyOn(userFunc, 'addUser');
jest.spyOn(userFunc, 'chkAdmin');
jest.spyOn(userFunc, 'getUserType');
jest.spyOn(userFunc, 'getUserDetails');
jest.spyOn(userFunc, 'getPassHash');
jest.spyOn(userFunc, 'modUserByAdmin');
jest.spyOn(userFunc, 'modUserByRegular');
jest.spyOn(userFunc, 'checkUserExists');
jest.spyOn(userFunc, 'deleteUser');
userFunc.addUser.mockImplementation(async (uname, passwd, utype, urole) => {
  const uObj = {
    username: uname,
    password: passwd,
    user_type: utype,
    user_role: urole,
  };
  if (userFunc.chkPassStrngth(uObj.password, 1))
    return [200, { message: 'User added successfully.' }];

  return [500, { message: 'User could not be added' }];
});

userFunc.getUserType.mockImplementation(async (uname) => {
  // const data = testData.corrUsers;
  const data = testData[dataArr[0]];
  let retVal;
  data.forEach((uObj) => {
    if (uname === uObj.username) retVal = uObj.user_type;
  });
  return retVal;
});

userFunc.chkAdmin.mockImplementation(async (uname) => {
  const userType = await userFunc.getUserType(uname);
  if (userType === undefined) {
    return undefined;
  }
  return userType.toLowerCase() === 'admin';
});

userFunc.getUserDetails.mockImplementation(async () => {
  const data = testData[dataArr[1]];
  let userData;
  let retVal;
  data.forEach((uObj) => {
    userData = {
      username: uObj.username,
      user_type: uObj.user_type,
      user_role: uObj.user_role,
    };
    retVal = [200, userData];
  });
  return retVal;
});

userFunc.getPassHash.mockImplementation(async (uname) => {
  const data = testData[dataArr[2]];
  let retVal;
  data.forEach((uObj) => {
    if (uname === uObj.username) retVal = uObj.corrHash;
  });
  return retVal;
});

userFunc.checkUserExists.mockImplementation(async (uname) => {
  const data = testData[dataArr[3]];
  let retVal = false;

  data.forEach((uObj) => {
    if (uname === uObj.username) retVal = true;
  });
  return retVal;
});

userFunc.modUserByAdmin.mockImplementation(
  async (uname, newPasswd, newUtype, newUrole) => {
    if (!(await userFunc.checkUserExists(uname)))
      return [404, { message: 'User does not exist.' }];
    if (!uname || !newPasswd || !newUtype || !newUrole) {
      return [
        400,
        {
          message:
            'Details could not be updated successfully due to missing user details please check all the entries.',
        },
      ];
    }
    const uObj = {
      username: uname,
      password: newPasswd,
      user_type: newUtype,
      user_role: newUrole,
    };
    if (uObj.username && uObj.password && uObj.user_type && uObj.user_role) {
      return [201, { message: 'Details updated successfully.' }];
    }
    return [500, { message: 'Details could not be updated successfully.' }];
  }
);

userFunc.modUserByRegular.mockImplementation(async (uname, newPasswd) => {
  if (!(await userFunc.checkUserExists(uname)))
    return [404, { message: 'User does not exist.' }];
  if (!uname || !newPasswd) {
    return [
      400,
      {
        message:
          'Details could not be updated successfully due to missing user details please check all the entries.',
      },
    ];
  }
  const uObj = {
    username: uname,
    password: newPasswd,
  };
  if (!!uObj.username && !!uObj.password)
    return [201, { message: 'Details updated successfully.' }];
  return [500, { message: 'Details could not be updated successfully.' }];
});

userFunc.deleteUser.mockImplementation(async (uname) => {
  const uObj = {
    username: uname,
  };
  uObj.username = null;
  return [200, { Message: 'User deleted successfully.' }];
});

describe('User addition endpoint', () => {
  let app;
  let agent;
  beforeAll(async () => {
    app = await makeApp(userFunc, reportFunc);
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userObj = testData.corrAdminUsers[2];
    agent = request.agent(app);
    await agent
      .post('/users/login-user')
      .send({ username: userObj.username, password: userObj.password });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call userAdd() function in the request', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userObj = testData.nonExistUser[0];
    await agent.post('/users/add-user').send(userObj);
    expect(userFunc.addUser).toHaveBeenCalled();
  });

  test('should call userAdd() function only once per request', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userObj = testData.nonExistUser[0];
    await agent.post('/users/add-user').send(userObj);
    expect(userFunc.addUser).toHaveBeenCalledTimes(1);
  });

  test('should return status code 200 for successful addition of user', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userInfo = testData.nonExistUser;
    await Promise.all(
      userInfo.map(async (userObj) => {
        const response = await agent.post('/users/add-user').send(userObj);
        expect(response.statusCode).toBe(200);
      })
    );
  });

  test('should return status code 400 for insufficient password strength', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userInfo = testData.insuffUserPass;

    await Promise.all(
      userInfo.map(async (userObj) => {
        const response = await agent.post('/users/add-user').send(userObj);
        expect(response.statusCode).toBe(400);
      })
    );
  });

  test('should return status code 400 for errors in parameters.', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userInfo = testData.missUserParams;
    await Promise.all(
      userInfo.map(async (userObj) => {
        const response = await agent.post('/users/add-user').send(userObj);
        expect(response.statusCode).toBe(400);
      })
    );
  });
});

describe('Get user details endpoint', () => {
  let app;
  let agent;
  beforeAll(async () => {
    app = await makeApp(userFunc, reportFunc);
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userObj = testData.corrAdminUsers[2];
    agent = request.agent(app);
    await agent
      .post('/users/login-user')
      .send({ username: userObj.username, password: userObj.password });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call getUserDetails() function', async () => {
    // const userObj = testData.corrAdminUsers[0];
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    await agent.get('/users/details-user').send();
    expect(userFunc.getUserDetails).toHaveBeenCalled();
  });

  test('should call getUserDetails() function exactly once per request', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userObj = testData.corrAdminUsers[0];
    await agent.get('/users/details-user').send({ username: userObj.username });
    expect(userFunc.getUserDetails).toHaveBeenCalledTimes(1);
  });

  test('should return status code 200', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userInfo = testData.corrAdminUsers;
    await Promise.all(
      userInfo.map(async (userObj) => {
        const response = await agent
          .get('/users/details-user')
          .send({ username: userObj.username });
        expect(response.statusCode).toBe(200);
      })
    );
  });

  test('should return all the details of the user', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userInfo = testData.corrAdminUsers;
    await Promise.all(
      userInfo.map(async (userObj) => {
        const response = await agent
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
  let app;
  beforeAll(async () => {
    app = await makeApp(userFunc, reportFunc);
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call the getPassHash() function', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userObj = testData.corrUsers[0];
    await request(app).post('/users/login-user').send({
      username: userObj.username,
      password: userObj.password,
    });
    expect(userFunc.getPassHash).toHaveBeenCalled();
  });

  test('should call getPassHash() only once per request', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userObj = testData.corrUsers[0];
    await request(app).post('/users/login-user').send({
      username: userObj.username,
      password: userObj.password,
    });
    expect(userFunc.getPassHash).toHaveBeenCalledTimes(1);
  });

  test('should return status code 200 for valid login', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
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
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
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
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
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

  test('should return 404 for missing username and 401 for missing password', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userInfo = testData.missUserParams;
    await Promise.all(
      userInfo.map(async (userObj) => {
        const response = await request(app)
          .post('/users/login-user')
          .send(userObj);
        if (!userObj.username) {
          expect(response.statusCode).toBe(404);
        } else if (!userObj.password) {
          expect(response.statusCode).toBe(401);
        }
      })
    );
  });
});

describe('Modify user endpoint', () => {
  let agent;
  let app;
  let agent2;
  beforeAll(async () => {
    app = await makeApp(userFunc, reportFunc);
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userObj = testData.corrAdminUsers[2];
    const userObj2 = testData.regularUsers[0];
    agent = request.agent(app);
    await agent
      .post('/users/login-user')
      .send({ username: userObj.username, password: userObj.password });
    agent2 = request.agent(app);
    await agent2
      .post('/users/login-user')
      .send({ username: userObj2.username, password: userObj2.password });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call modUserByAdmin() function', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userInfo = testData.regularUsers[0];
    await agent.put('/users/modify-user').send(userInfo);
    expect(userFunc.modUserByAdmin).toHaveBeenCalled();
  });

  test('should call modUserByAdmin() function only once per request', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userInfo = testData.regularUsers[0];
    await agent.put('/users/modify-user').send(userInfo);
    expect(userFunc.modUserByAdmin).toHaveBeenCalledTimes(1);
  });

  test('should call modUserByRegular() function', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userInfo = testData.regularUsers[0];
    await agent2.put('/users/modify-user').send(userInfo);
    expect(userFunc.modUserByRegular).toHaveBeenCalled();
  });

  test('should call modUserByRegular() function only once per request', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userInfo = testData.regularUsers[0];
    await agent2.put('/users/modify-user').send(userInfo);
    expect(userFunc.modUserByRegular).toHaveBeenCalledTimes(1);
  });

  test('should return status code of 201 when update done successfully by the Admin', async () => {
    dataArr = ['regularUsers', 'corrAdminUsers', 'corrPassArr', 'regularUsers'];
    const userInfo = testData.regularUsers;
    await Promise.all(
      userInfo.map(async (userObj) => {
        const response = await agent.put('/users/modify-user').send(userObj);
        expect(response.statusCode).toBe(201);
      })
    );
  });

  test('should return status code 404 for update to a user which does not exist', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userInfo = testData.nonExistUser;
    await Promise.all(
      userInfo.map(async (userObj) => {
        const response = await agent.put('/users/modify-user').send(userObj);
        expect(response.statusCode).toBe(404);
      })
    );
  });

  test('should return status code 404 if username not provided and 400 for other missing parameters', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userInfo = testData.missUserParams;
    await Promise.all(
      userInfo.map(async (userObj) => {
        const response = await agent.put('/users/modify-user').send(userObj);
        if (!userObj.username) expect(response.statusCode).toBe(404);
        else expect(response.statusCode).toBe(400);
      })
    );
  });
});

describe('Delete user endpoint', () => {
  let app;
  let agent;
  beforeAll(async () => {
    app = await makeApp(userFunc, reportFunc);
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userObj = testData.corrAdminUsers[2];
    agent = request.agent(app);
    await agent
      .post('/users/login-user')
      .send({ username: userObj.username, password: userObj.password });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call deleteUser() function', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userInfo = testData.corrUsers[0];
    await agent.delete('/users/delete-user').send(userInfo);
    expect(userFunc.deleteUser).toHaveBeenCalled();
  });

  test('should call deleteUser() function only once per request', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userInfo = testData.corrAdminUsers[0];
    await agent.delete('/users/delete-user').send(userInfo);
    expect(userFunc.deleteUser).toHaveBeenCalledTimes(1);
  });

  test('should return status code of 200 for successful deletion', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userInfo = testData.corrAdminUsers;
    await Promise.all(
      userInfo.map(async (userObj) => {
        const response = await agent.delete('/users/delete-user').send(userObj);
        expect(response.statusCode).toBe(200);
      })
    );
  });

  test('should return status code of 404 for missing username', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userInfo = { username: '' };
    const response = await agent.delete('/users/delete-user').send(userInfo);
    expect(response.statusCode).toBe(404);
  });

  test('should return status code 404 for wrong username', async () => {
    dataArr = ['corrUsers', 'corrAdminUsers', 'corrPassArr', 'corrUsers'];
    const userInfo = testData.nonExistUser;
    await Promise.all(
      userInfo.map(async (userObj) => {
        const response = await agent.delete('/users/delete-user').send(userObj);
        expect(response.statusCode).toBe(404);
      })
    );
  });
});
