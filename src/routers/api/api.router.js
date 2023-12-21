import {Router, json } from "express"
import { productsRouter } from "./products.router.js"
import { cartsRouter } from "./carts.router.js"
import {sesionesRouter} from './sesiones.router.js'
import {usuariosRouter} from './usuarios.router.js'

export const apiRouter = Router()

apiRouter.use(json())

apiRouter.use('/products', productsRouter)
apiRouter.use('/carts', cartsRouter)
apiRouter.use('/sessions', sesionesRouter)
apiRouter.use('/users', usuariosRouter)