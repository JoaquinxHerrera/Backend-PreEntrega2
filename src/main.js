import express from 'express'
import mongoose from 'mongoose'
import { engine } from 'express-handlebars'
import { apiRouter } from './routers/api/api.router.js'
import { webRouter } from './routers/web/web.router.js'
import {sessions} from './middlewares/sesiones.js'
import {COOKIE_SECRET, MONGODB_CNX_STR, PORT} from './config.js'
import axios from 'axios';
import { connect } from './database/database.js'
import cookieParser from 'cookie-parser'
import { passportInitialize, passportSession } from './middlewares/authentication.js'


connect()

const app = express()

app.engine('handlebars', engine())

app.listen(PORT, ()=>{
    console.log(`servidor escuchando peticiones en puerto: ${PORT}`)
})
app.use('/static', express.static('static'));

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(sessions)
app.use(cookieParser(COOKIE_SECRET))
app.use(passportInitialize, passportSession)


app.use('/api', apiRouter)
app.use('/', webRouter)










