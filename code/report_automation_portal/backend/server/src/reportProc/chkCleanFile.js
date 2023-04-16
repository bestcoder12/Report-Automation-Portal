import { fileTypeFromFile } from 'file-type';
import NodeClam from 'clamscan';

const clamOpts = {
  removeInfected: true,
  scanLog: './uploads/clamscan.log',
};

const chkCleanFile = async (fileInfo) => {
  const fileType = await fileTypeFromFile(fileInfo.path);
  let errCode = 0;
  if (
    fileType.ext !== 'xlsx' ||
    fileType.mime !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    errCode = 1;
  }

  const clamScan = await new NodeClam().init(clamOpts);
  const { file, isInfected, viruses } = await clamScan.isInfected(
    fileInfo.path
  );
  if (isInfected) {
    console.err(`The file ${file} scanned is infected with ${viruses}!`);
    errCode = 2;
  }
  return errCode;
};

export default chkCleanFile;
