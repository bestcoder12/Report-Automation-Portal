import * as dotenv from 'dotenv';
import db from '../middleware/database.js';
import userOps from '../middleware/db_user.js';
import reportOps from './reportProc/db_report.js';
import makeApp from './app.js';

dotenv.config();

const server = async () => {
  const userFunc = await userOps(db);
  const reportFunc = await reportOps(db);
  const app = await makeApp(userFunc, reportFunc);
  const port = process.env.SERVER_PORT || 8080;
  app.listen(port, () => {
    console.log(`Express App listening on port ${port}`);
  });
};

export default server;

server();
