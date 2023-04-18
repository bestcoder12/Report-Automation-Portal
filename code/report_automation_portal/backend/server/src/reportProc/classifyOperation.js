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
    switch (reportType) {
      case 'olt-monthly':
        await reportFunc.fetchOltMonthly(reportFile, reportId);
        break;
      case 'olt-net-provider':
        await reportFunc.fetchOltMonthly(reportFile, reportId);
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
