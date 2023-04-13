import mysql from 'mysql2';
import * as expressSession from 'express-session';
import expressMySqlSession from 'express-mysql-session';
import configMysql, { optionSession } from '../config/configMysql.js';

const db = mysql.createPool(configMysql).promise();
// export const sessionStore = new MySQLStore(optionSession, db)
const MySQLStore = expressMySqlSession(expressSession);
export const sessionStore = new MySQLStore(optionSession, db);

db.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection lost.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections!');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
  }
  if (connection) connection.release();
});

export default db;
