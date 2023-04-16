const reportOps = async (db) => {
  const uploadReportToDB = async (reportType, reportDate, reportSessn) => {
    console.log(db, reportType, reportDate, reportSessn);
    return [200, { message: 'Report added to Database' }];
  };

  return { uploadReportToDB };
};

export default reportOps;
