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
  let res;
  try {
    res = await axios(config);
  } catch (err) {
    console.error('Could not upload file.');
  }
  return { statusCode: res.status, data: res.data };
};

export default sendFile;
