const reportOps = async (db) => {
  const uploadReportToDB = async (
    reportType,
    reportDate,
    reportSessn,
    reportPath
  ) => {
    const upldQuery = 'INSERT INTO fileLoc VALUES (?,?,?,?);';
    console.log(reportType, reportDate, reportSessn, reportPath);
    const upldQueryRes = await db.query(upldQuery, [
      reportType,
      reportDate,
      reportSessn,
      reportPath,
    ]);
    if (upldQueryRes[0].affectedRows !== 1) {
      return [
        500,
        { message: 'Report could not be added due to some database error.' },
      ];
    }
    return [200, { message: 'Report added to Database' }];
  };

  return { uploadReportToDB };
};

export default reportOps;
