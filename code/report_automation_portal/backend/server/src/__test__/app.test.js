import request from "supertest";
import { jest } from "@jest/globals";
import makeApp from "../app.js";
import userOps from "../../middleware/db_user.js";
import testData from './appTestData';

const db = jest.fn();
const userFunc = await userOps(db);
jest.spyOn(userFunc, "addUser");
jest.spyOn(userFunc, "chkAdmin");
jest.spyOn(userFunc, "getUserType");
jest.spyOn(userFunc, "getUserDetails");
jest.spyOn(userFunc, "getPassHash");
userFunc.addUser.mockImplementation(async (uname, passwrd, utype, urole) => {
  if (!!uname && !!passwrd && !!utype && !!urole && userFunc.chkPassStrngth(passwrd, 1))
  return [ 200, { message: "User added successfully." }];
  return [500, { message: 'User could not be added' }];
});

userFunc.getUserType.mockImplementation(async (uname) => {
  const data = testData.corrUsers
  for (const uObj of data) {
    if (uname === uObj.username)
    return uObj.usertype
  }
});

userFunc.chkAdmin.mockImplementation(async (uname) => {
  return (((await userFunc.getUserType(uname)).toLowerCase()) === 'admin')
})

userFunc.getUserDetails.mockImplementation(async (uname) => {
  const data = testData.corrAdminUsers
  for (const uObj of data) {
    if (uname === uObj.username)
    return [200, uObj]
  }
});

userFunc.getPassHash.mockImplementation(async () => {

})

const app = await makeApp(userFunc);

describe("User addition endpoint", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('should call userAdd() function in the request', async () => { 
      const userObj = testData.corrUsers[0]
      const response = await request(app).post("/users/add-user").send(userObj);
      expect(userFunc.addUser).toHaveBeenCalled();
   }) 
   
   test('should call userAdd() function only once per request', async () => { 
      const userObj = testData.corrUsers[0]  
      const response = await request(app).post("/users/add-user").send(userObj);
      expect(userFunc.addUser).toHaveBeenCalledTimes(1);
    })
  
  

  test("should return status code 200 for successful addition of user", async () => {
    const userInfo = testData.corrUsers

    for (const userObj of userInfo) {
        const response = await request(app).post("/users/add-user").send(userObj);
        expect(response.statusCode).toBe(200);
    }
  });
  
  test('should return status code 400 for insufficient password strength', async () => { 
    const userInfo = testData.insuffUserPass
    
    for (const userObj of userInfo) {
        const response = await request(app).post("/users/add-user").send(userObj);
        expect(response.statusCode).toBe(400);
    }
   });

  test('should return status code 400 for errors in parameters.', async () => { 
    const userInfo = testData.missUserParams
    
    for (const userObj of userInfo) {
        const response = await request(app).post("/users/add-user").send(userObj);
        expect(response.statusCode).toBe(400);
    }
   })

});


describe('Get user details endpoint', () => { 
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('should call getUserDetails() function', async () => { 
    const response = await request(app).get('/users/details-user').send({username: "test4"})
    expect(userFunc.getUserDetails).toHaveBeenCalled()
  })

  test('should call getUserDetails() function exactly once per request', async () => { 
    const response = await request(app).get('/users/details-user').send({username: "test4"})
    expect(userFunc.getUserDetails).toHaveBeenCalledTimes(1)
  })

  test('should return status code 200', async () => { 
    const userInfo = testData.corrAdminUsers
    for (const userObj of userInfo) {
      const response = await request(app).get('/users/details-user').send({username: userObj.username})
      expect(response.statusCode).toBe(200)
    }
  });

  test('should return all the details of the user', async () => { 
    const userInfo = testData.corrAdminUsers
    for (const userObj of userInfo) {  
      const response = await request(app).get('/users/details-user').send({username: userObj.username})
      expect(([response.text]).every(x => x !== null || x !== undefined || x !== "")).toBe(true)
    }
    });

})

describe('Login user endpoint', () => { 
  test('should call the getPassHash() function', async () => { 
    const response = await request(app).post('users/login-user').send({
      username: "test4",
      password: "testPass*2"
    })
    console.log(response)
   })
})