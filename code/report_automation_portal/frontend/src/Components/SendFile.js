import axios from 'axios';

const sendFile = async (formData) => {
  const config = {
    method: 'post',
    url: 'http://localhost:8080/reports/upload-report',
    headers: {
      'content-type': 'multipart/form-data',
    },
    data: formData,
  };
  console.log(config);
  let res;
  try {
    res = await axios(config);
    return { statusCode: res.status, data: res.data };
  } catch (err) {
    console.error('Could not upload file.');
    return { statusCode: err.response.status, data: err.response.data };
  }
};

export default sendFile;
