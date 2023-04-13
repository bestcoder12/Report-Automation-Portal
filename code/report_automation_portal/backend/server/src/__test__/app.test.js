import request from "supertest";
import { jest } from "@jest/globals";
import makeApp from "../app.js";
import userOps from "../../middleware/db_user.js";
//import mysql from 'mysql2';

/* const chkPassStrngth = jest.fn()
const getPassHash = jest.fn()
const getUserType = jest.fn()
const checkUserExists = jest.fn()
const chkAdmin = jest.fn()
const addUser = jest.fn().mockResolvedValue()
const modUserByAdmin = jest.fn()
const modUserByRegular = jest.fn()
const deleteUser = jest.fn()
const getUserDetails = jest.fn() */

/* const addUser = jest.fn(() => {
    return [200, {message: "User added successfully"}]
}) */

//jest.mock('mysql2');

/* const mockQuery = mysql.query
console.log(mockQuery)

beforeEach(() => {
    mockQuery.mockReset()
}) */
//const db = undefined
const db = jest.fn();
/* jest.mock('../../middleware/db_user', () => {
    const original = jest.requireActual('../../middleware/db_user')
    const ori_userFunc = original(db)
    return {
        ...ori_userFunc,
        addUser: jest.fn()
    }
}) */

const userFunc = await userOps(db);
jest.spyOn(userFunc, "addUser");

userFunc.addUser.mockImplementation(async () => {
  return { statusCode: 200, json: { message: "User added successfully." } };
});
/* const db = jest.fn()
let userFunc = await userOps(db) 
const mockUserAdd = userFunc.addUser
console.log(mockUserAdd) */
/* const userFunc = await userOps(db) */

const app = await makeApp(userOps);

describe("User addition endpoint", () => {
  test("should return status code 200 for successful addition of user", async () => {
    //addUser.mockReset()
    //mockQuery.mockResolvedValue([{affectedRows: 1}])
    const response = await request(app).post("/users/add-user").send({
      username: "test2",
      password: "testPass#4",
      usertype: "Regular",
      userrole: "Employee",
    });
    expect(response.statusCode).toBe(200);
  });

  /* test('should get all the details of the user', async () => { 
        const response = await request(app).get('/users/details-user').send({
            username: "test1"
        })
        console.log(response)
     }) */
});
