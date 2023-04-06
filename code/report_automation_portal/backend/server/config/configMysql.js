import * as  dotenv from 'dotenv';
dotenv.config()

const configMysql = {
    "multipleStatements": true,
    "charset": 'UTF8_GENERAL_CI',
    "connectionLimit": "50",
    "host": process.env.MYSQL_HOST,
    "user": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE
}

export default configMysql;

