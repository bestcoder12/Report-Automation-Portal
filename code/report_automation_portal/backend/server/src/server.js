import * as  dotenv from 'dotenv';
dotenv.config()
import db from '../middleware/database.js';
import userOps from '../middleware/db_user.js';
import makeApp from './app.js';

export const server = async () =>{
    const userFunc = await userOps(db)
    const app = await makeApp(userFunc)
    const port = process.env.SERVER_PORT || 8080;
    app.listen(port, () => {
        console.log(`Express App listening on port ${port}`)
    })
}

server()