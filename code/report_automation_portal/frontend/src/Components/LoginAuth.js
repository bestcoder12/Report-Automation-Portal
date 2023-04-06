import React from 'react';
import mysql from 'mysql';
import { configMysql } from '../db_config/conf_mysql'

const pool = mysql.createPool(configMysql).promise()
