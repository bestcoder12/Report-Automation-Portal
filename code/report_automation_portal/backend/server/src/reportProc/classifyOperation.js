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
        retVal = await reportFunc.storeOltNet(reportFile, reportId);
        break;
      case 'ont-ticket':
        retVal = await reportFunc.storeOntTicket(reportFile, reportId);
        break;
      case 'unknown-ont':
        retVal = await reportFunc.storeUnkwnOnt(reportFile, reportId);
        break;
      case 'ont-net-provider':
        retVal = await reportFunc.storeOntNet(reportFile, reportId);
        break;
      case 'mismatch-ont':
        retVal = await reportFunc.storeMismtchOnt(reportFile, reportId);
        break;
      default:
        retVal = [404, { message: 'The report type does not exist.' }];
    }
  } else if (opType === 'fetch') {
    let reportLoc;
    switch (reportType) {
      case 'olt-monthly':
        reportLoc = 'olt_monthly';
        retVal = await reportFunc.fetchReport(reportType, reportLoc, reportId);
        break;
      case 'olt-net-provider':
        reportLoc = 'olt_net_provider';
        retVal = await reportFunc.fetchReport(reportType, reportLoc, reportId);
        break;
      case 'ont-ticket':
        reportLoc = 'ont_ticket';
        retVal = await reportFunc.fetchReport(reportType, reportLoc, reportId);
        break;
      case 'unknown-ont':
        reportLoc = 'unknown_ont';
        retVal = await reportFunc.fetchReport(reportType, reportLoc, reportId);
        break;
      case 'ont-net-provider':
        reportLoc = 'ont_net_provider';
        retVal = await reportFunc.fetchReport(reportType, reportLoc, reportId);
        break;
      case 'mismatch-ont':
        reportLoc = 'mismatch_ont';
        retVal = await reportFunc.fetchReport(reportType, reportLoc, reportId);
        break;
      case 'olt-status':
        reportLoc = 'olt_status';
        retVal = await reportFunc.fetchReport(reportType, reportLoc, reportId);
        break;
      case 'ont-status':
        reportLoc = 'ont_status';
        retVal = await reportFunc.fetchReport(reportType, reportLoc, reportId);
        break;
      case 'mark-for-del':
        reportLoc = 'mark_for_del';
        retVal = await reportFunc.fetchReport(reportType, reportLoc, reportId);
        break;
      case 'loc-config-pending':
        reportLoc = 'loc_config_pending';
        retVal = await reportFunc.fetchReport(reportType, reportLoc, reportId);
        break;
      default:
        retVal = [404, { message: 'The report type does not exist.' }];
    }
  } else if (opType === 'generate') {
    switch (reportType) {
      case 'olt-status':
        retVal = await reportFunc.genOltStatus(reportId);
        break;
      case 'ont-status':
        retVal = await reportFunc.genOntStatus(reportId);
        break;
      case 'mark-for-del':
        retVal = await reportFunc.genMarkDel(reportId);
        break;
      case 'loc-config-pending':
        retVal = await reportFunc.genLocConfigPending(reportId);
        break;
      default:
        retVal = [404, { message: 'The report type does not exist.' }];
    }
  }
  return retVal;
};

export default classifyOperation;
