import * as dotenv from 'dotenv';

dotenv.config();

const IN_PROD = process.env.NODE_ENV === 'production';
const ONE_HOUR = 1000 * 60 * 60;

const configMysql = {
  multipleStatements: true,
  charset: 'UTF8_GENERAL_CI',
  connectionLimit: '50',
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

export const optionSession = {
  host: 'localhost',
  port: 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.SESSION_DATABASE,
  cookie: {
    httpOnly: true,
    maxAge: ONE_HOUR,
    sameSite: true,
    secure: IN_PROD,
  },
};

export default configMysql;
