import { Router } from "express"
import { createOrderController } from "../../controllers/tickets.controller.js"

export const ordersRouter = Router()

ordersRouter.post('/', createOrderController)