import axios from 'axios';

const getUsers = async () => {
  let res;
  const config = {
    method: 'get',
    url: 'http://localhost:8080/users/details-user',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    res = await axios(config);
  } catch (err) {
    console.error('Could not get response from server.', err);
  }
  return { statusCode: res.status, data: res.data };
};

export default getUsers;
