import axios from 'axios';

const getReportData = async (fileData) => {
  console.log(fileData);
  const config = {
    method: 'get',
    url: 'http://localhost:8080/reports/generate-report',
    headers: {
      'content-type': 'application/json',
    },
    params: fileData,
  };

  let res;
  try {
    res = await axios(config);
    return { statusCode: res.status, data: res.data };
  } catch (err) {
    console.error('Could not get data from server.');
    return { statusCode: err.response.status, data: err.response.data };
  }
};

export default getReportData;
