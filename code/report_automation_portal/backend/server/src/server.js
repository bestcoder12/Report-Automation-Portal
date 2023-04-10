import express from 'express';
import cors from 'cors';
import validatePass from './auth/validatePass.js';
import { getPassHash, addUser } from '../middleware/db_user.js';
import session from 'express-session'
import * as  dotenv from 'dotenv';
dotenv.config()
import sessionStore from '../middleware/database.js'
import bcrypt from 'bcrypt';

export const server = async () =>{
    const app = express()
    app.use(express.json())
    app.use(cors())
    
    
    const port = process.env.SERVER_PORT || 8080;
    
    app.use (session({
        key: process.env.SESSION_KEY,
        secret: process.env.SESSION_SECRET,
        //store: sessionStore,
        resave: true,
        saveUninitialized: false
    }))

    app.post('/users/login-user', express.urlencoded({ extended: false }), async (req, res) => {
        const passHash = await getPassHash(req.body.username)
        if (passHash === undefined) {
            // User may not exist or typo in username
            console.log(`The user ${req.body.username} being queried doesn't exist.`)
            res.status(404).send({"Message":"Username incorrect. Please check the username."})
            //res.redirect('/')
        }

        const validPass = await validatePass(req.body.password, passHash)
        console.log(validPass)
        if (validPass) {
            req.session.regenerate((err) => {
                if (err) next(err)
                console.log(req.session)
                req.session.validSession = true
                req.session.user = req.body.username
                req.session.save((err) => {
                    if (err) return next(err)
                    //res.redirect('/Dashboard')
                })
            }) 
            res.status(200).json({"Message" : "Yay! Logged in."})
        }
        else {
            req.session.validSession = false
            res.status(200).json({"Message" : "Oh no. Wrong password"})
            //res.redirect('/Login')
        }
    })

    
    app.post('/users/add-user', async (req, res) => {
        const userType = 'test'
        const userRole = 'test2'
        const [addStatus, addMesg] = await addUser(req.body.username, req.body.password, userType, userRole)
        res.status(addStatus).json(addMesg)
    })
    
    app.get('/users/logout', async (req, res) => {
        
    })
    
    app.use((err, req, res, next) => {
        console.log(err)
        res.status(500).send('Something broke')
    })

    app.listen(port, () => {
        console.log(`Express App listening on port ${8080}`)
    })
}

server()