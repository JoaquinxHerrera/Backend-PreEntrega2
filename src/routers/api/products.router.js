import { Router } from "express";
import { deleteController, getController, getIdController, postController, putController } from "../../controllers/products.controller.js";
import { isAdmin, isPremium } from "../../middlewares/authorization.js";

export const productsRouter = Router()

productsRouter.get('/', getController)
productsRouter.get('/:id', getIdController)
productsRouter.post('/', isAdmin, isPremium, postController)
productsRouter.put('/:id', isAdmin, isPremium, putController)
productsRouter.delete('/:id', isAdmin,isPremium, deleteController)
