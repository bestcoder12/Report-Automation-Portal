import axios from 'axios';

const loginAuth = async (userData) => {
  let res;
  const config = {
    method: 'post',
    url: 'http://localhost:8080/users/login-user',
    headers: {
      'Content-Type': 'application/json',
    },
    data: userData,
  };
  try {
    res = await axios(config);
    return { statusCode: res.status, data: res.data };
  } catch (err) {
    console.error('Could not get response from server.', err);
    return { statusCode: err.response.status, data: err.response.data };
  }
};

export default loginAuth;
