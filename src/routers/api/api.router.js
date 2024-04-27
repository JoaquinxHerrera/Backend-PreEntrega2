import {Router, json, urlencoded } from "express"
import { productsRouter } from "./products.router.js"
import { cartsRouter } from "./carts.router.js"
import {sesionesRouter} from './sesiones.router.js'
import {usuariosRouter} from './usuarios.router.js'
import { errorHandler } from "../../middlewares/errorHandler.js"
import { improvedAnswers } from "../../middlewares/improvedAnswers.js"

import { httpLogger } from "../../middlewares/httpLogger.js"
import { sendResetEmailController } from "../../controllers/mails.controller.js"
import { isAdmin, onlyLoggedRest } from "../../middlewares/authorization.js"
import { deleteInactiveController } from "../../controllers/user.controller.js"


export const apiRouter = Router()

apiRouter.use(httpLogger)

apiRouter.use(json())
apiRouter.use(urlencoded({extended: true}))

apiRouter.use('/products', productsRouter)
apiRouter.use('/carts', cartsRouter)
apiRouter.use('/sessions', sesionesRouter)
apiRouter.use('/users', usuariosRouter)

apiRouter.post('/sendResetEmail', onlyLoggedRest, sendResetEmailController)
apiRouter.delete('/inactive', isAdmin, deleteInactiveController)
apiRouter.use(errorHandler)