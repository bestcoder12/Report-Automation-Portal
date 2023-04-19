const classifyOperation = async (
  reportFile,
  reportType,
  reportId,
  opType,
  reportFunc
) => {
  let retVal;
  if (opType === 'store') {
    switch (reportType) {
      case 'olt-monthly':
        retVal = await reportFunc.storeOltMonthly(reportFile, reportId);
        break;
      case 'olt-net-provider':
        await reportFunc.storeOltNet(reportFile, reportId);
        break;
      case 'ont-ticket':
        break;
      case 'unknown-ont':
        break;
      case 'ont-net-provider':
        break;
      case 'mismatch-ont':
        break;
      case 'olt-status':
        break;
      case 'ont-status':
        break;
      case 'mark-for-delete':
        break;
      case 'loc-config-pending':
        break;
      case 'aging-olt-unreach':
        break;
      default:
        retVal = [404, { message: 'The report type does not exist.' }];
    }
  } else if (opType === 'fetch') {
    let reportLoc;
    switch (reportType) {
      case 'olt-monthly':
        reportLoc = 'olt_monthly';
        retVal = await reportFunc.fetchReport(reportLoc, reportId);
        break;
      case 'olt-net-provider':
        reportLoc = 'olt_net_provider';
        retVal = await reportFunc.fetchReport(reportLoc, reportId);
        break;
      case 'ont-ticket':
        break;
      case 'unknown-ont':
        break;
      case 'ont-net-provider':
        break;
      case 'mismatch-ont':
        break;
      case 'olt-status':
        reportLoc = 'olt_status';
        retVal = await reportFunc.fetchReport(reportLoc, reportId);
        break;
      case 'ont-status':
        reportLoc = 'ont_status';
        retVal = await reportFunc.fetchReport(reportLoc, reportId);
        break;
      case 'mark-for-del':
        break;
      case 'loc-config-pending':
        break;
      default:
        retVal = [404, { message: 'The report type does not exist.' }];
    }
  } else if (opType === 'generate') {
    // let reportLoc;
    switch (reportType) {
      case 'olt-status':
        // reportLoc = 'olt_status';
        retVal = await reportFunc.genOltStatus(reportType, reportId);
        break;
      case 'ont-status':
        // reportLoc = 'ont_status';
        // retVal = await reportFunc.genReport();
        break;
      case 'mark-for-del':
        break;
      case 'loc-config-pending':
        break;
      default:
        retVal = [404, { message: 'The report type does not exist.' }];
    }
  }
  return retVal;
};

export default classifyOperation;
