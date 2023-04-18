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
    const resReportExist = db.query(reportExistQuery, [reportId]);
    const reportExist = Object.values([resReportExist][0][0])[0];
    return reportExist !== 0;
  };

  const getJsonFromXlsx = (filePath, fileHeaders) => {
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
    const actData = getJsonFromXlsx(reportFile.path, reportHeaders);
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
    const actData = getJsonFromXlsx(reportFile.path, reportHeaders);
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

  const fetchReport = async (reportType, reportId) => {
    const fetchQuery = 'SELECT * FROM ?? WHERE report_id = ?';
    const [resFetchQuery] = await db.query(fetchQuery, [reportType, reportId]);
    return [200, resFetchQuery];
  };

  return {
    getReportId,
    chkReportExists,
    storeReportToServer,
    storeOltMonthly,
    storeOltNet,
    fetchReport,
  };
};

export default reportOps;
