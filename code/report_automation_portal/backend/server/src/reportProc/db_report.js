/* import { readFileSync } from 'fs'; */
import * as XLSX from 'xlsx';
import * as fs from 'fs';

XLSX.set_fs(fs);

const reportOps = async (db) => {
  const getReportId = async (reportType, reportDate, reportSessn) =>
    `${reportType}$${reportDate.replace(/\s/g, '')}$${reportSessn.replace(
      /\s/g,
      ''
    )}`;

  const storeReportToServer = async (
    reportType,
    reportDate,
    reportSessn,
    reportPath
  ) => {
    const reportId = await getReportId(reportType, reportDate, reportSessn);
    const upldQuery = 'INSERT INTO file_loc VALUES (?, ?,?,?,?);';
    const resUpldQuery = await db.query(upldQuery, [
      reportId,
      reportType,
      reportDate,
      reportSessn,
      reportPath,
    ]);
    if (resUpldQuery[0].affectedRows !== 1) {
      return [
        500,
        { message: 'Report could not be added due to some database error.' },
        undefined,
      ];
    }
    return [200, { message: 'Report added to Database' }, reportId];
  };

  const chkReportExists = async (reportId) => {
    const reportExistQuery =
      'SELECT EXISTS (SELECT 1 FROM file_loc WHERE report_id = ?);';
    const resReportExist = await db.query(reportExistQuery, [reportId]);
    const reportExist = Object.values([resReportExist][0][0])[0];
    return reportExist !== 0;
  };

  const getJsonFromXLSX = (filePath, fileHeaders) => {
    const workbook = XLSX.readFile(filePath);
    const sheetNameList = workbook.SheetNames;
    const jsonData = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetNameList[0]],
      {
        sheetStubs: true,
        origin: 3,
        defval: undefined,
        header: fileHeaders,
      }
    );
    return jsonData.slice(4, -2);
  };

  const storeDataAsXLSX = async (reportDate, storeData) => {
    const dataWorkSheet = XLSX.utils.json_to_sheet(storeData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, dataWorkSheet, 'Sheet1');
    const filePath = `uploads/report_${reportDate.getDate()}-${
      reportDate.getMonth() + 1
    }-${reportDate.getFullYear()}_${Math.round(Math.random())}.xlsx`;
    XLSX.writeFile(workbook, filePath);
    return [200, { message: 'File stored to successfully.' }];
  };

  const getGPCode = async (gpName, blockName) => {
    const gpCodeQuery =
      'SELECT gp_code FROM gp_master_list WHERE gp_name=? AND block=?;';
    const [[resGPCode]] = await db.query(gpCodeQuery, [gpName, blockName]);
    return resGPCode;
  };

  const convertDate = async (dateStr) => {
    if (!dateStr || dateStr === '--') return null;
    const dateParts = dateStr.split('-');
    const timeParts = dateParts[2].split(' ')[1].split(':');
    [dateParts[2]] = dateParts[2].split(' ');
    // month is 0-based, that's why we need dataParts[1] - 1
    const storeDate = new Date(
      +dateParts[2],
      dateParts[1] - 1,
      +dateParts[0],
      timeParts[0],
      timeParts[1],
      timeParts[2]
    )
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
    return storeDate;
  };

  const storeOltMonthly = async (reportFile, reportId) => {
    const reportHeaders = [
      'STATE',
      'DISTRICT',
      'BLOCK',
      'OLT LOCATION',
      'OLT LOCATION CODE',
      'OLT IP',
      'OLT NAME',
      'TOTAL DOWN TIME',
      'TOTAL UNREACHABLE TIME',
      'OLT AVAILABILITY(%)',
      'PHASE',
    ];
    const actData = getJsonFromXLSX(reportFile.path, reportHeaders);
    const storeOltMonthlyQuery =
      'INSERT INTO olt_monthly VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';

    let retVal;

    await Promise.all(
      actData.map(async (rowData) => {
        const gpCode = await getGPCode(rowData['OLT LOCATION'], rowData.BLOCK);
        if (gpCode !== undefined) {
          const resOltMonthlyQuery = await db.query(
            storeOltMonthlyQuery,
            [reportId, gpCode.gp_code].concat(Object.values(rowData))
          );
          if (resOltMonthlyQuery.affectedRows !== [1]) {
            retVal = [
              500,
              { message: 'The data could not be inserted into the database.' },
            ];
          }
          retVal = [200, { message: 'The data was uploaded successfully.' }];
        }
      })
    );
    return retVal;
  };

  const storeOltNet = async (reportFile, reportId) => {
    const reportHeaders = [
      'NETWORK PROVIDER',
      'DISTRICT',
      'BLOCK',
      'OLT LOCATION',
      'OLT LOCATION CODE',
      'OLT NAME',
      'OLT IP',
      'EMS NAME',
      'POINT ASSET CODE',
      'VENDOR',
      'TECH NAME',
      'VERSION',
      'OLT STATE',
      'STATE CHANGE TIME',
      'COMMISSION DATE',
      'NMS CONFIG DATE',
      'AT TIME',
      'OLT ADDED TIME',
      'HSTATUS',
      'HSTATUS CHANGE TIME',
      'STARTED USER',
      'CONFIGURED PIC COUNT',
      'CONFIGURED PON COUNT',
      'CONFIGURED ONT COUNT',
      'EMS CONNECTION TYPE',
      'EMS VLAN ID',
      'MARK FOR DELETE',
      'REMARKS',
      'OWNER',
    ];
    let retVal;
    const actData = getJsonFromXLSX(reportFile.path, reportHeaders);
    const storeOltNetQuery =
      'INSERT INTO olt_net_provider VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
    await Promise.all(
      actData.map(async (rowData) => {
        let resOltNetQuery;
        const gpCode = await getGPCode(rowData['OLT LOCATION'], rowData.BLOCK);
        let resRowData;
        if (gpCode !== undefined) {
          let dateRowData;
          const dateCols = Object.keys(rowData).filter((key) =>
            /(date|time)+/gi.test(key)
          );
          await Promise.all(
            dateCols.map(async (dateKey) => {
              resRowData = rowData;
              dateRowData = await convertDate(rowData[dateKey]);
              resRowData[dateKey] = dateRowData;
            })
          );
          resOltNetQuery = await db.query(
            storeOltNetQuery,
            [reportId, gpCode.gp_code].concat(Object.values(resRowData))
          );

          if (resOltNetQuery.affectedRows !== [1]) {
            retVal = [
              500,
              { message: 'The data could not be inserted into the database.' },
            ];
          }
          retVal = [200, { message: 'The data was uploaded successfully.' }];
        }
      })
    );
    return retVal;
  };

  const storeOltStatus = async (reportId, storeData) => {
    const storeOltStatusQuery = 'INSERT INTO olt_status VALUES (?,?,?,?,?,?)';
    let resStoreOltStatus;
    let retVal;
    await Promise.all(
      storeData.map(async (rowData) => {
        resStoreOltStatus = await db.query(
          storeOltStatusQuery,
          [reportId].concat(Object.values(rowData))
        );
        if (resStoreOltStatus.affectedRows !== [1]) {
          retVal = [
            500,
            { message: 'The data could not be inserted into the database.' },
          ];
        }
        retVal = [200, { message: 'The data was uploaded successfully.' }];
      })
    );
    return retVal;
  };

  const fetchReport = async (reportType, reportId) => {
    const fetchQuery = 'SELECT * FROM ?? WHERE report_id = ?';
    const [resFetchQuery] = await db.query(fetchQuery, [reportType, reportId]);
    return [200, resFetchQuery];
  };

  const genOltStatus = async (reportId) => {
    const genOltStatusQuery = `WITH unreach_olt AS 
    (
      SELECT  
        report_id, 
        district, 
        SUM(IF(olt_state LIKE '%UNREACHABLE', 1, 0)) AS UNREACHABLE 
      FROM olt_net_provider
      GROUP BY report_id, district
      HAVING report_id = ?
    ), up_olt AS
    (
      SELECT 
        report_id, 
        district, 
        SUM(IF(olt_state LIKE '%UP', 1, 0)) AS UP 
      FROM olt_net_provider 
      GROUP BY report_id, district
      HAVING report_id = ?
    ), total_olt AS
    (
      SELECT 
        up_olt.report_id,
        up_olt.district, 
        unreach_olt.unreachable, 
        up_olt.up, 
        (unreach_olt.unreachable +  up_olt.up) AS grand_total 
      FROM up_olt
      JOIN unreach_olt
      ON up_olt.district = unreach_olt.district
        AND up_olt.report_id = unreach_olt.report_id
      GROUP BY up_olt.report_id, up_olt.district
      HAVING report_id = ?
    ), percent_olt_up AS
    ( 
      SELECT 
        total_olt.report_id,
        total_olt.district,
        total_olt.unreachable,
        total_olt.up,
        total_olt.grand_total,
        ROUND(((total_olt.up / total_olt.grand_total) * 100),2) AS perc_up
      FROM total_olt
    ) SELECT
      percent_olt_up.district, 
      percent_olt_up.unreachable, 
      percent_olt_up.up, 
      percent_olt_up.grand_total, 
      percent_olt_up.perc_up 
    FROM percent_olt_up
    JOIN olt_net_provider ON percent_olt_up.report_id = olt_net_provider.report_id 
      AND percent_olt_up.district = olt_net_provider.district
    GROUP BY percent_olt_up.report_id, percent_olt_up.district
    HAVING percent_olt_up.report_id = ?;`;

    const [resGenOltStatus] = await db.query(genOltStatusQuery, [
      reportId,
      reportId,
      reportId,
      reportId,
    ]);
    let resStoreOltStatus = await storeOltStatus(reportId, resGenOltStatus);
    if (resStoreOltStatus[0] !== 200) {
      return resStoreOltStatus;
    }
    const reportDate = new Date();
    resStoreOltStatus = await storeDataAsXLSX(reportDate, resGenOltStatus);
    if (resStoreOltStatus[0] !== 200) {
      return resStoreOltStatus;
    }
    return [200, resGenOltStatus];
  };

  return {
    getReportId,
    chkReportExists,
    storeReportToServer,
    storeOltMonthly,
    storeOltNet,
    fetchReport,
    genOltStatus,
  };
};

export default reportOps;
