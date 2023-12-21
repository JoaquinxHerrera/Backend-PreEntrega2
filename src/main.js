import express from 'express'
import mongoose from 'mongoose'
import { engine } from 'express-handlebars'
import { apiRouter } from './routers/api/api.router.js'
import { webRouter } from './routers/web/web.router.js'
import {sessions} from './middlewares/sesiones.js'
import {MONGODB_CNX_STR, PORT} from './config.js'
import axios from 'axios';
// import products from '../products.json' assert { type: 'json' }
// import { Product } from './models/Product.js'

await mongoose.connect(MONGODB_CNX_STR)
console.log(`conectado a base de datos en: "${MONGODB_CNX_STR}"`)

// await Product.deleteMany({})
// await Product.insertMany(products)
const app = express()

app.engine('handlebars', engine())

app.listen(PORT, ()=>{
    console.log(`servidor escuchando peticiones en puerto: ${PORT}`)
})
app.use('/static', express.static('static'));

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(sessions)

app.use('/api', apiRouter)
app.use('/', webRouter)










