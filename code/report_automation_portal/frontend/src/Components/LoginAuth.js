import axios from 'axios';

const loginAuth = async () => {
  const userObj = {
    username: 'Adam',
    password: 'Applebear$6',
  };
  // Response done
  const res = await axios.post(
    'http://localhost:8080/users/login-user',
    userObj
  );
  console.log(res);
};

export default loginAuth;
