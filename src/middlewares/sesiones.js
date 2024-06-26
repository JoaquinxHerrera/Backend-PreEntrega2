import session from 'express-session'
import connectMongo from 'connect-mongo'
import { MONGODB_CNX_STR, SESSION_SECRET } from '../config/config.js'

const store = connectMongo.create({
    mongoUrl: MONGODB_CNX_STR,
    ttl: 60*60*24 //1d
})

export const sessions = session({
    store,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 },
})


