export const configMysql = {
    multipleStatements: true,
    charset: 'UTF8_GENERAL_CI',
    connectionLimit: 50,
    host: process.env.MYSQL_HOST,
    socketPath: '/run/mysqld/mysqld.sock',
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE 
};
