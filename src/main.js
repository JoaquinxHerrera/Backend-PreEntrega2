import express from 'express'
import mongoose from 'mongoose'
import { engine } from 'express-handlebars'
import { apiRouter } from './routers/api.router.js'
import { webRouter } from './routers/web.router.js'
// import products from '../products.json' assert { type: 'json' }
// import { Product } from './models/Product.js'


await mongoose.connect('mongodb+srv://joacoherrera98:PreEntrega2@cluster0.a33vlyl.mongodb.net/')
console.log('conectado a mongodb')

// await Product.deleteMany({})
// await Product.insertMany(products)
const app = express()

app.engine('handlebars', engine())

app.listen(8080, () =>{console.log('conectado a puerto 8080')})
app.use('/static', express.static('static'));
app.use('/api', apiRouter)
app.use('/', webRouter)










