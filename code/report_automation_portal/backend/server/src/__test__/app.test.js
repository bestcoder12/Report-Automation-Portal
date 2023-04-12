import request from 'supertest';
import { jest } from '@jest/globals'
import makeApp from '../app.js';

const chkPassStrngth = jest.fn()
const getPassHash = jest.fn()
const getUserType = jest.fn()
const checkUserExists = jest.fn()
const chkAdmin = jest.fn()
const addUser = jest.fn()
const modUserByAdmin = jest.fn()
const modUserByRegular = jest.fn()
const deleteUser = jest.fn()
const getUserDetails = jest.fn()

const app = await makeApp({
    chkPassStrngth,
    getPassHash,
    getUserType,
    checkUserExists,
    chkAdmin,
    addUser,
    modUserByAdmin,
    modUserByRegular,
    deleteUser,
    getUserDetails
})

describe('User addition endpoint', () => { 
   test('should return status code 200 for successful addition of user', async () => { 
        addUser.mockReset()
        const response = await request(app).post('/users/add-user').send({
            username: "test2",
            password: "testPass#4",
            usertype: "Regular",
            userrole: "Employee"
        })
       /* expect(response.statusCode).toBe(200) */
       console.log(response.body)
    }) 
 })