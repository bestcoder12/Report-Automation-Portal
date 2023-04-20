import axios from 'axios';

const loginAuth = async (userObj) => {
  const res = await axios.post(
    'http://localhost:8080/users/login-user',
    userObj
  );
  return res;
};

export default loginAuth;
