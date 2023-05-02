/* import { readFileSync } from 'fs'; */
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import reportArr from './reportHeaders.js';

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
    let reportId;
    try {
      reportId = await getReportId(reportType, reportDate, reportSessn);
    } catch (err) {
      console.error('Could not get reportId from the database.', err);
    }
    const upldQuery = 'INSERT INTO file_loc VALUES (?,?,?,?,?);';
    let resUpldQuery;
    try {
      resUpldQuery = await db.query(upldQuery, [
        reportId,
        reportType,
        reportDate,
        reportSessn,
        reportPath,
      ]);
    } catch (err) {
      console.error('Could not get upload file to the database.', err);
    }
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
    let resReportExist;
    try {
      resReportExist = await db.query(reportExistQuery, [reportId]);
    } catch (err) {
      console.error(
        'Could not check existence of report in the database.',
        err
      );
    }
    const reportExist = Object.values(
      Object.values([resReportExist][0][0])[0]
    )[0];
    return reportExist !== 0;
  };

  const getJsonFromXLSX = (filePath, fileHeaders) => {
    let workbook;
    try {
      workbook = XLSX.readFile(filePath);
    } catch (err) {
      console.error('Could not read the file.', err);
    }
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

  const storeDataAsXLSX = async (reportId, storeData) => {
    const dataWorkSheet = XLSX.utils.json_to_sheet(storeData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, dataWorkSheet, 'Sheet1');
    const [reportType, reportDate, reportSession] = reportId.split('$');
    const filePath = `uploads/report_${reportType}_${reportDate}_${reportSession}.xlsx`;
    try {
      XLSX.writeFile(workbook, filePath);
    } catch (err) {
      console.error('Could not write file to the server.', err);
    }
    return [200, { message: 'File stored to successfully.' }, filePath];
  };

  const getGPCode = async (gpName, blockName) => {
    const gpCodeQuery =
      'SELECT gp_code FROM gp_master_list WHERE gp_name=? AND block=?;';
    let resGPCode;
    try {
      [[resGPCode]] = await db.query(gpCodeQuery, [gpName, blockName]);
    } catch (err) {
      console.error('Could not get GP code from the database.', err);
    }
    return resGPCode;
  };

  const convertDate = async (dateStr) => {
    if (!dateStr || dateStr === '--' || dateStr === 'NULL') return null;
    if (typeof dateStr === 'number') {
      const serialExcelDate = dateStr;
      const excelDate = new Date((serialExcelDate - 25569) * 86400000)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');
      return excelDate;
    }
    const parts = dateStr.split(' ');
    const dateDelimiter = dateStr.indexOf('/') !== -1 ? '/' : '-';
    const dateFormat = dateDelimiter === '-' ? 'DD-MM-YYYY' : 'DD/MM/YYYY';
    let year;
    let month;
    let day;
    if (dateFormat === 'DD-MM-YYYY') {
      [day, month, year] = parts[0].split('-');
    } else {
      [day, month, year] = parts[0].split('/');
    }
    const timeParts = parts.length > 1 ? parts[1].split(':') : [0, 0, 0];

    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2], 10);
    const storeDate = new Date(year, month - 1, day, hours, minutes, seconds)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
    return storeDate;
  };

  const storeOltMonthly = async (reportFile, reportId) => {
    const reportHeaders = reportArr['olt-monthly'].headers;
    const actData = getJsonFromXLSX(reportFile.path, reportHeaders);
    const storeOltMonthlyQuery =
      'INSERT INTO olt_monthly VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';

    let retVal;

    await Promise.all(
      actData.map(async (rowData) => {
        const gpCode = await getGPCode(rowData['OLT LOCATION'], rowData.BLOCK);
        if (gpCode !== undefined) {
          let resOltMonthlyQuery;
          try {
            resOltMonthlyQuery = await db.query(
              storeOltMonthlyQuery,
              [reportId, gpCode.gp_code].concat(Object.values(rowData))
            );
          } catch (err) {
            console.error('Could not add row to the database.', err);
          }
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
    const reportHeaders = reportArr['olt-net-provider'].headers;
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
          try {
            resOltNetQuery = await db.query(
              storeOltNetQuery,
              [reportId, gpCode.gp_code].concat(Object.values(resRowData))
            );
          } catch (err) {
            console.error('Could not add row to the database.', err);
          }

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

  const storeOntNet = async (reportFile, reportId) => {
    const reportHeaders = reportArr['ont-net-provider'].headers;
    let retVal;
    const actData = getJsonFromXLSX(reportFile.path, reportHeaders);
    const storeOntNetQuery =
      'INSERT INTO ont_net_provider VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
    await Promise.all(
      actData.map(async (rowData) => {
        let resOntNetQuery;
        const gpCode = await getGPCode(rowData.PANCHAYAT, rowData.BLOCK);
        let resRowData;
        if (gpCode !== undefined) {
          let dateRowData;
          const dateCols = Object.keys(rowData).filter((key) =>
            /(date|time)+/gi.test(key)
          );
          await Promise.all(
            dateCols.map(async (dateKey) => {
              resRowData = rowData;
              try {
                dateRowData = await convertDate(rowData[dateKey]);
              } catch (error) {
                console.log(rowData[dateKey]);
              }
              resRowData[dateKey] = dateRowData;
            })
          );
          try {
            resOntNetQuery = await db.query(
              storeOntNetQuery,
              [reportId, gpCode.gp_code].concat(Object.values(resRowData))
            );
          } catch (err) {
            console.error('Could not add row to the database.', err);
          }
          if (resOntNetQuery.affectedRows !== [1]) {
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

  const storeOntTicket = async (reportFile, reportId) => {
    const reportHeaders = reportArr['ont-ticket'].headers;
    let retVal;
    const actData = getJsonFromXLSX(reportFile.path, reportHeaders);
    const storeOntTicketQuery =
      'INSERT INTO ont_ticket VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
    await Promise.all(
      actData.map(async (rowData) => {
        let resOntTicketQuery;
        const gpCode = await getGPCode(rowData.Panchayat, rowData.BLOCK);
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
          try {
            resOntTicketQuery = await db.query(
              storeOntTicketQuery,
              [reportId, gpCode.gp_code].concat(Object.values(resRowData))
            );
          } catch (err) {
            console.error('Could not add row to the database.', err);
          }

          if (resOntTicketQuery.affectedRows !== [1]) {
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

  const storeUnkwnOnt = async (reportFile, reportId) => {
    const reportHeaders = reportArr['unknown-ont'].headers;
    let retVal;
    const actData = getJsonFromXLSX(reportFile.path, reportHeaders);
    const storeUnkwnOntQuery =
      'INSERT INTO unknown_ont VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
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
          try {
            resOltNetQuery = await db.query(
              storeUnkwnOntQuery,
              [reportId, gpCode.gp_code].concat(Object.values(resRowData))
            );
          } catch (err) {
            console.error('Could not add row to the database.', err);
          }

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

  const storeMismtchOnt = async (reportFile, reportId) => {
    const reportHeaders = reportArr['mismatch-ont'].headers;
    let retVal;
    const actData = getJsonFromXLSX(reportFile.path, reportHeaders);
    const storeMismtchOntQuery =
      'INSERT INTO mismatch_ont VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
    await Promise.all(
      actData.map(async (rowData) => {
        let resMismtchOntQuery;
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
          try {
            resMismtchOntQuery = await db.query(
              storeMismtchOntQuery,
              [reportId, gpCode.gp_code].concat(Object.values(resRowData))
            );
          } catch (err) {
            console.error('Could not add row to the database.', err);
          }

          if (resMismtchOntQuery.affectedRows !== [1]) {
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
    const storeOltStatusQuery = 'INSERT INTO olt_status VALUES (?,?,?,?,?,?);';
    let resStoreOltStatus;
    let retVal;
    await Promise.all(
      storeData.map(async (rowData) => {
        try {
          resStoreOltStatus = await db.query(
            storeOltStatusQuery,
            [reportId].concat(Object.values(rowData))
          );
        } catch (err) {
          console.error('Could not store data to the database.', err);
        }
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

  const storeOntStatus = async (reportId, storeData) => {
    const storeOntStatusQuery =
      'INSERT INTO ont_status VALUES (?,?,?,?,?,?,?,?);';
    let resStoreOntStatus;
    let retVal;
    await Promise.all(
      storeData.map(async (rowData) => {
        try {
          resStoreOntStatus = await db.query(
            storeOntStatusQuery,
            [reportId].concat(Object.values(rowData))
          );
        } catch (err) {
          console.error('Could not store data to the database.', err);
        }
        if (resStoreOntStatus.affectedRows !== [1]) {
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

  const storeMarkDel = async (reportId, storeData) => {
    const storeMarkDelQuery = 'INSERT INTO ont_status VALUES (?,?,?,?);';
    let resStoreMarkDel;
    let retVal;
    await Promise.all(
      storeData.map(async (rowData) => {
        try {
          resStoreMarkDel = await db.query(
            storeMarkDelQuery,
            [reportId].concat(Object.values(rowData))
          );
        } catch (err) {
          console.error('Could not store data to the database.', err);
        }
        if (resStoreMarkDel.affectedRows !== [1]) {
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

  const storeLocConfigPending = async (reportId, storeData) => {
    const storeLocConfigPendingQuery = 'INSERT INTO ont_status VALUES (?,?,?);';
    let resStoreLocConfigPending;
    let retVal;
    await Promise.all(
      storeData.map(async (rowData) => {
        try {
          resStoreLocConfigPending = await db.query(
            storeLocConfigPendingQuery,
            [reportId].concat(Object.values(rowData))
          );
        } catch (err) {
          console.error('Could not store data to the database.', err);
        }
        if (resStoreLocConfigPending.affectedRows !== [1]) {
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

  const fetchReport = async (reportType, reportLoc, reportId) => {
    const fetchQuery = 'SELECT * FROM ?? WHERE report_id = ?';
    let resFetchQuery;
    try {
      [resFetchQuery] = await db.query(fetchQuery, [reportLoc, reportId]);
    } catch (err) {
      console.error('Could not fetch report from the database.', err);
    }
    const mtData = reportArr[reportType];
    return [
      200,
      {
        rows: resFetchQuery,
        metaData: mtData,
      },
    ];
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

    let resGenOltStatus;
    const splitId = reportId.split('$');
    const reportType = splitId[0];
    splitId[0] = 'olt-net-provider';
    const srcReportId = splitId.join('$');
    const srcReportExists = await chkReportExists(srcReportId);
    if (!srcReportExists) {
      return [
        404,
        {
          message:
            'The report type required for generating the report does not exist.',
        },
      ];
    }
    try {
      [resGenOltStatus] = await db.query(genOltStatusQuery, [
        srcReportId,
        srcReportId,
        srcReportId,
        srcReportId,
      ]);
    } catch (err) {
      console.error('Could not generate the report from the database.', err);
    }
    let resFileStore;
    let filePath;
    try {
      [resFileStore, , filePath] = await storeDataAsXLSX(
        reportId,
        resGenOltStatus
      );
    } catch (err) {
      console.error('Could not store the file to the server.', err);
    }
    if (resFileStore !== 200) {
      return resFileStore;
    }
    try {
      [resFileStore] = await storeReportToServer(
        reportType,
        splitId[1],
        splitId[2],
        filePath
      );
    } catch (err) {
      console.error('Could not store the file information to database.', err);
    }
    if (resFileStore !== 200) {
      return resFileStore;
    }
    let resStoreOltStatus;
    try {
      resStoreOltStatus = await storeOltStatus(reportId, resGenOltStatus);
    } catch (err) {
      console.error('Could not store the data to the database.', err);
    }
    if (resStoreOltStatus[0] !== 200) {
      return resStoreOltStatus;
    }
    try {
      resStoreOltStatus = await storeDataAsXLSX(splitId[1], resGenOltStatus);
    } catch (err) {
      console.error('Could not store the file to the server.', err);
    }
    if (resStoreOltStatus[0] !== 200) {
      return resStoreOltStatus;
    }
    return [
      200,
      {
        rows: resGenOltStatus,
        metaData: reportArr[reportType],
      },
    ];
  };

  const genOntStatus = async (reportId) => {
    const genOntStatusQuery = ``;

    let resGenOntStatus;
    const splitId = reportId.split('$');
    const reportType = splitId[0];
    splitId[0] = 'ont-net-provider';
    const srcReportId = splitId.join('$');
    const srcReportExists = await chkReportExists(srcReportId);
    if (!srcReportExists) {
      return [
        404,
        {
          message:
            'The report type required for generating the report does not exist.',
        },
      ];
    }
    try {
      [resGenOntStatus] = await db.query(genOntStatusQuery, [
        srcReportId,
        srcReportId,
        srcReportId,
        srcReportId,
      ]);
    } catch (err) {
      console.error('Could not generate the report from the database.', err);
    }
    let resFileStore;
    let filePath;
    try {
      [resFileStore, , filePath] = await storeDataAsXLSX(
        reportId,
        resGenOntStatus
      );
    } catch (err) {
      console.error('Could not store the file to the server.', err);
    }
    if (resFileStore !== 200) {
      return resFileStore;
    }
    try {
      [resFileStore] = await storeReportToServer(
        reportType,
        splitId[1],
        splitId[2],
        filePath
      );
    } catch (err) {
      console.error('Could not store the file information to database.', err);
    }
    if (resFileStore !== 200) {
      return resFileStore;
    }
    let resStoreOntStatus;
    try {
      resStoreOntStatus = await storeOntStatus(reportId, resGenOntStatus);
    } catch (err) {
      console.error('Could not store the data to the database.', err);
    }
    if (resStoreOntStatus[0] !== 200) {
      return resStoreOntStatus;
    }
    try {
      resStoreOntStatus = await storeDataAsXLSX(splitId[1], resGenOntStatus);
    } catch (err) {
      console.error('Could not store the file to the server.', err);
    }
    if (resStoreOntStatus[0] !== 200) {
      return resStoreOntStatus;
    }
    return [
      200,
      {
        rows: resGenOntStatus,
        metaData: reportArr[reportType],
      },
    ];
  };

  const genMarkDel = async (reportId) => {
    const genMarkDelQuery = ``;

    let resGenMarkDel;
    const splitId = reportId.split('$');
    const reportType = splitId[0];
    splitId[0] = 'ont-net-provider';
    const srcReportId = splitId.join('$');
    const srcReportExists = await chkReportExists(srcReportId);
    if (!srcReportExists) {
      return [
        404,
        {
          message:
            'The report type required for generating the report does not exist.',
        },
      ];
    }
    try {
      [resGenMarkDel] = await db.query(genMarkDelQuery, [
        srcReportId,
        srcReportId,
        srcReportId,
        srcReportId,
      ]);
    } catch (err) {
      console.error('Could not generate the report from the database.', err);
    }
    let resFileStore;
    let filePath;
    try {
      [resFileStore, , filePath] = await storeDataAsXLSX(
        reportId,
        resGenMarkDel
      );
    } catch (err) {
      console.error('Could not store the file to the server.', err);
    }
    if (resFileStore !== 200) {
      return resFileStore;
    }
    try {
      [resFileStore] = await storeReportToServer(
        reportType,
        splitId[1],
        splitId[2],
        filePath
      );
    } catch (err) {
      console.error('Could not store the file information to database.', err);
    }
    if (resFileStore !== 200) {
      return resFileStore;
    }
    let resStoreOntStatus;
    try {
      resStoreOntStatus = await storeMarkDel(reportId, resGenMarkDel);
    } catch (err) {
      console.error('Could not store the data to the database.', err);
    }
    if (resStoreOntStatus[0] !== 200) {
      return resStoreOntStatus;
    }
    try {
      resStoreOntStatus = await storeDataAsXLSX(splitId[1], resGenMarkDel);
    } catch (err) {
      console.error('Could not store the file to the server.', err);
    }
    if (resStoreOntStatus[0] !== 200) {
      return resStoreOntStatus;
    }
    return [
      200,
      {
        rows: resGenMarkDel,
        metaData: reportArr[reportType],
      },
    ];
  };

  const genLocConfigPending = async (reportId) => {
    const genLocConfigPendingQuery = ``;

    let resGenLocConfigPending;
    const splitId = reportId.split('$');
    const reportType = splitId[0];
    splitId[0] = 'ont-net-provider';
    const srcReportId = splitId.join('$');
    const srcReportExists = await chkReportExists(srcReportId);
    if (!srcReportExists) {
      return [
        404,
        {
          message:
            'The report type required for generating the report does not exist.',
        },
      ];
    }
    try {
      [resGenLocConfigPending] = await db.query(genLocConfigPendingQuery, [
        srcReportId,
        srcReportId,
        srcReportId,
        srcReportId,
      ]);
    } catch (err) {
      console.error('Could not generate the report from the database.', err);
    }
    let resFileStore;
    let filePath;
    try {
      [resFileStore, , filePath] = await storeDataAsXLSX(
        reportId,
        resGenLocConfigPending
      );
    } catch (err) {
      console.error('Could not store the file to the server.', err);
    }
    if (resFileStore !== 200) {
      return resFileStore;
    }
    try {
      [resFileStore] = await storeReportToServer(
        reportType,
        splitId[1],
        splitId[2],
        filePath
      );
    } catch (err) {
      console.error('Could not store the file information to database.', err);
    }
    if (resFileStore !== 200) {
      return resFileStore;
    }
    let resStoreOntStatus;
    try {
      resStoreOntStatus = await storeLocConfigPending(
        reportId,
        resGenLocConfigPending
      );
    } catch (err) {
      console.error('Could not store the data to the database.', err);
    }
    if (resStoreOntStatus[0] !== 200) {
      return resStoreOntStatus;
    }
    try {
      resStoreOntStatus = await storeDataAsXLSX(
        splitId[1],
        resGenLocConfigPending
      );
    } catch (err) {
      console.error('Could not store the file to the server.', err);
    }
    if (resStoreOntStatus[0] !== 200) {
      return resStoreOntStatus;
    }
    return [
      200,
      {
        rows: resGenLocConfigPending,
        metaData: reportArr[reportType],
      },
    ];
  };

  return {
    getReportId,
    chkReportExists,
    storeReportToServer,
    storeOltMonthly,
    storeOltNet,
    storeOntNet,
    storeOntTicket,
    storeUnkwnOnt,
    storeMismtchOnt,
    fetchReport,
    genOltStatus,
    genOntStatus,
    genMarkDel,
    genLocConfigPending,
  };
};

export default reportOps;
