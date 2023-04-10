import db from './database.js';
import bcrypt from 'bcrypt';

export const getPassHash = async (userName) => {
    const passHashQuery = 'SELECT pass_hash FROM user WHERE username=?;'
    const [rowUserHash] = await db.query(passHashQuery, [userName])
    if (rowUserHash === undefined) {
        return undefined
    }
    return rowUserHash[0].pass_hash
}


export const addUser = async (userName, userPassword, userType, userRole) => {
    const addUserQuery = 'INSERT INTO user VALUES (?, ?, ?, ?);'
    const chkExistUser = 'SELECT EXISTS (SELECT 1 FROM user WHERE username = ?);'
    const [resExistUser] = await db.query(chkExistUser, [userName])
    const userExist = Object.values([resExistUser][0][0])[0]  
    if (userExist !== 0)
    {
        addMesg = "User already exists. Please try a different username."
        return [200, addMesg]
    }
    const insrtPassHash = await bcrypt.hash(userPassword, 12)
    const addMesg = await db.query(addUserQuery, [userName, insrtPassHash, userType, userRole])
    return [200, addMesg['affectedRows']]
}