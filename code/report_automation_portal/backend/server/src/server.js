import express from 'express';
import cors from 'cors';
import configMysql from '../config/configMysql.js';
import mysql from 'mysql';

export const server = async () =>{
    const db = mysql.createPool(configMysql);
    const app = express()
    app.use(express.json())
    app.use(cors())
    const port = 8080;

    app.get('/users', (req, res) => {
        const user_query = 'SELECT * FROM users';
        db.query(user_query, (err, data) => {
            console.log(err, data);
            if (err) return res.json({ error: err.sqlMessage });
            else return res.json({ data });
        })
    })

    app.listen(port, () => {
        console.log(`Example app listening on port ${8080}`)
    })
}

server()