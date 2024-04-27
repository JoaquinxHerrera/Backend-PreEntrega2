import express from 'express'
import mongoose from 'mongoose'
import { engine } from 'express-handlebars'
import { apiRouter } from './routers/api/api.router.js'
import { webRouter } from './routers/web/web.router.js'
import {sessions} from './middlewares/sesiones.js'
import {COOKIE_SECRET, MONGODB_CNX_STR, PORT} from './config/config.js'
import axios from 'axios';
import { connect } from './database/database.js'
import cookieParser from 'cookie-parser'
import { passportInitialize, passportSession } from './middlewares/authentication.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'
import { logger } from './utils/logger.js'

// import swaggerJsdoc from 'swagger-jsdoc'
// import swaggerUiExpress from 'swagger-ui-express'

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

app.get("/mail", async (req, res) => {
    let result = await transport.sendMail({
      from: "Joaquin Herrera - Desarrollador web <joaquin.xherrera1@gmail.com>",
      to: "joacoherrera98@hotmail.com",
      subject: "reestablece tu contraseña",
      html: `
      <div>
        
          <h1>presiona el boton para iniciar el proceso de reestablecimiento</h1>
          <a href='http://localhost:8080/resetpassword'>ir</a>
        
      </div>
      `,
      attachments: [],
    });
    res.send({ status: "success", result: "email sent" });
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


const spec = swaggerJSDoc({
    definition:{
        openapi: '3.0.1',
        info:{
            version:'1',
            tilte: 'Swagger Demo',
            description:'Demo de swagger para coderhouse'
        }
    },
    apis: ['./docs/**/*.yaml']
})
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec))

app.use('/api', apiRouter)
app.use('/', webRouter)










