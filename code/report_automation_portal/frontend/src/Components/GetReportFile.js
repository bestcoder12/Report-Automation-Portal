import axios from 'axios';

const getReportFile = async (fileData) => {
  let res;
  const config = {
    method: 'get',
    url: 'http://localhost:8080/report/download-report',
    responseType: 'blob',
    params: fileData,
  };
  try {
    res = await axios(config);
    return res;
  } catch (err) {
    console.error('Could not get response from server.', err);
    return err;
  }
};

export default getReportFile;
