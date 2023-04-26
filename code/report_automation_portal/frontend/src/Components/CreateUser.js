import axios from 'axios';

const createUser = async (userData) => {
  let res;
  const config = {
    method: 'post',
    url: 'http://localhost:8080/users/add-user',
    headers: {
      'Content-Type': 'application/json',
    },
    data: userData,
  };
  try {
    res = await axios(config);
  } catch (err) {
    console.error('Could not get response from server.', err);
  }
  return { statusCode: res.status, data: res.data };
};

export default createUser;
