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

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received');
    if (server.closeAllConnections) server.closeAllConnections();
    else setTimeout(() => process.exit(0), 5000);
    server.close(() => {
      console.log('Server is now closed.');
      db.end((err) => {
        if (err) throw err;
        process.exit(0);
      });
    });
  });
};

export default server;

server();
