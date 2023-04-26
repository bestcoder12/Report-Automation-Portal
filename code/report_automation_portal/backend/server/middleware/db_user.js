import bcrypt from 'bcrypt';

const userOps = async (db) => {
  const chkPassStrngth = (ptPassword, strngthLvl) => {
    const lowerUpperChk = (str) => {
      const upper = /[A-Z]/.test(str);
      const lower = /[a-z]/.test(str);
      return upper && lower;
    };
    const numChk = (str) => /\d/.test(str);

    switch (strngthLvl) {
      case 0:
        if (
          ptPassword.length > 6 &&
          lowerUpperChk(ptPassword) &&
          numChk(ptPassword)
        ) {
          return true;
        }
        return false;
      case 1: {
        const symbolChk = (str) =>
          /[\s~`!@#$%^&*+=\-[\]\\';,/{}|\\":<>?()._]/g.test(str);

        if (
          ptPassword.length > 8 &&
          lowerUpperChk(ptPassword) &&
          symbolChk(ptPassword) &&
          numChk(ptPassword)
        ) {
          return true;
        }
        return false;
      }
      default:
        return undefined;
    }
  };

  const getPassHash = async (userName) => {
    const passHashQuery = 'SELECT pass_hash FROM user WHERE username=?;';
    let rowUserHash;
    try {
      [rowUserHash] = await db.query(passHashQuery, [userName]);
    } catch (err) {
      console.error('Could not get the password hash from database.', err);
      return undefined;
    }
    if (rowUserHash === undefined) {
      return undefined;
    }
    return rowUserHash[0].pass_hash;
  };

  const getUserType = async (userName) => {
    const userTypeQuery = 'SELECT user_type FROM user WHERE username=?;';
    let resTypeQuery;
    try {
      [resTypeQuery] = await db.query(userTypeQuery, [userName]);
    } catch (err) {
      console.error('Could not get the user type from database.', err);
      return undefined;
    }
    const userType = Object.values(resTypeQuery[0])[0];
    return userType;
  };

  const checkUserExists = async (userName) => {
    const chkExistUser =
      'SELECT EXISTS (SELECT 1 FROM user WHERE username = ?);';
    let resExistUser;
    try {
      [resExistUser] = await db.query(chkExistUser, [userName]);
    } catch (err) {
      console.error('Could not check the existence of user in database.', err);
      return false;
    }
    const userExist = Object.values([resExistUser][0][0])[0];
    return userExist !== 0;
  };

  const chkAdmin = async (userName) =>
    (await getUserType(userName)).toLowerCase() === 'admin';

  const addUser = async (userName, userPassword, userType, userRole) => {
    const addUserQuery = 'INSERT INTO user VALUES (?, ?, ?, ?);';
    let retVal;
    const insrtPassHash = await bcrypt.hash(userPassword, 12);
    let addMesg;
    try {
      addMesg = await db.query(addUserQuery, [
        userName,
        insrtPassHash,
        userType,
        userRole,
      ]);
    } catch (err) {
      console.error('Could not add user to the database.', err);
      return [
        500,
        { message: 'User could not be added due to some database error.' },
      ];
    }
    if (addMesg[0].affectedRows === 1) {
      retVal = [200, { message: 'User created successfully' }];
    } else {
      retVal = [
        500,
        { message: 'User could not be added due to some database error.' },
      ];
    }
    return retVal;
  };

  const modUserByAdmin = async (userName, newPassword, newType, newRole) => {
    let retVal;
    if (!userName || !newPassword || !newType || !newRole) {
      retVal = [
        400,
        {
          message:
            'Details could not be updated successfully due to missing user details please check all the entries.',
        },
      ];
    }
    const newPassHash = await bcrypt.hash(newPassword, 12);
    const modUserQuery =
      'UPDATE user SET pass_hash=?, user_type=?, user_role=? WHERE username=?;';
    let modResult;
    try {
      modResult = await db.query(modUserQuery, [
        newPassHash,
        newType,
        newRole,
        userName,
      ]);
    } catch (err) {
      console.error('Could not update user details in database.', err);
      return retVal;
    }
    if (modResult[0].affectedRows === 1) {
      retVal = [201, { message: 'Details updated successfully.' }];
    }
    return retVal;
  };

  const modUserByRegular = async (userName, newPassword) => {
    let retVal;
    if (!userName || !newPassword) {
      retVal = [
        400,
        {
          message:
            'Details could not be updated successfully due to missing user details please check all the entries.',
        },
      ];
    }
    const newPassHash = await bcrypt.hash(newPassword, 12);
    const modUserQuery = 'UPDATE user SET pass_hash=? WHERE username=?;';
    let modResult;
    try {
      modResult = await db.query(modUserQuery, [newPassHash, userName]);
    } catch (err) {
      console.error('Could not update user details in the database.', err);
      return retVal;
    }
    if (modResult[0].affectedRows === 1) {
      retVal = [201, { message: 'Details updated successfully.' }];
    } else {
      retVal = [500, { Message: 'Details could not be updated successfully.' }];
    }
    return retVal;
  };

  const deleteUser = async (userName) => {
    const delUserQuery = 'DELETE FROM user WHERE username=?;';
    let delResult;
    try {
      delResult = await db.query(delUserQuery, [userName]);
    } catch (err) {
      console.error('Could not delete the user from database.', err);
      return [500, { Message: 'User could not be deleted.' }];
    }
    if (delResult[0].affectedRows === 1) {
      return [200, { Message: 'User deleted successfully.' }];
    }
    return [500, { Message: 'User could not be deleted.' }];
  };

  const getUserDetails = async () => {
    const detailUserQuery = 'SELECT username, user_type, user_role FROM user;';
    let resUserDetails;
    try {
      [resUserDetails] = await db.query(detailUserQuery, []);
    } catch (err) {
      console.error('Could not get user details from database.', err);
      return [
        500,
        { message: 'Could not find the user or unable to fetch its details.' },
      ];
    }
    return [200, resUserDetails];
  };

  return {
    chkPassStrngth,
    getPassHash,
    getUserType,
    checkUserExists,
    chkAdmin,
    addUser,
    modUserByAdmin,
    modUserByRegular,
    deleteUser,
    getUserDetails,
  };
};

export default userOps;
