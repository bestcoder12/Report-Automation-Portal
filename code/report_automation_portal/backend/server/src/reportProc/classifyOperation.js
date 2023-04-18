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
    }
  }
  return retVal;
};

export default classifyOperation;
