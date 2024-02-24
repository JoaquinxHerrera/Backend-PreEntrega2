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
import { logger } from './utils/logger.js'
import { httpLogger } from './middlewares/httpLogger.js'


connect()

const app = express()

app.get("/loggerTest", (req, res) => {
    logger.debug("LOGGER TEST DEBUG");
    logger.http("LOGGER TEST HTTP");
    logger.info("LOGGER TEST INFO");
    logger.warning("LOGGER TEST WARNING");
    logger.error("LOGGER TEST ERROR");
    logger.fatal("LOGGER TEST FATAL");
    return;
});

app.engine('handlebars', engine())

app.listen(PORT, ()=>{
    logger.info(`servidor escuchando peticiones en puerto: ${PORT}`)
})
app.use('/static', express.static('static'));

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(sessions)
app.use(cookieParser(COOKIE_SECRET))
app.use(passportInitialize, passportSession)


app.use('/api', apiRouter)
app.use('/', webRouter)












