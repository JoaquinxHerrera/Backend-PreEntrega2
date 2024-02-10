import {Router, json, urlencoded } from "express"
import { productsRouter } from "./products.router.js"
import { cartsRouter } from "./carts.router.js"
import {sesionesRouter} from './sesiones.router.js'
import {usuariosRouter} from './usuarios.router.js'
import { errorHandler } from "../../middlewares/errorHandler.js"
import { improvedAnswers } from "../../middlewares/improvedAnswers.js"
import { ordersRouter } from "./orders.router.js"

export const apiRouter = Router()

apiRouter.use(improvedAnswers)

apiRouter.use(json())
apiRouter.use(urlencoded({extended: true}))

apiRouter.use('/products', productsRouter)
apiRouter.use('/carts', cartsRouter)
apiRouter.use('/sessions', sesionesRouter)
apiRouter.use('/users', usuariosRouter)
apiRouter.use('/orders', ordersRouter)

apiRouter.use(errorHandler)