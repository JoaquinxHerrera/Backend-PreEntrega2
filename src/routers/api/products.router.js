import { Router } from "express";
import { deleteController, getController, getIdController, postController, putController } from "../../controllers/products.controller.js";
import { isAdmin, isPremium, isPremiumOrAdmin, onlyLoggedRest } from "../../middlewares/authorization.js";

export const productsRouter = Router()

productsRouter.get('/', getController)
productsRouter.get('/:id', getIdController)
productsRouter.post('/', onlyLoggedRest, isPremiumOrAdmin, postController)
productsRouter.put('/:id', onlyLoggedRest, isPremiumOrAdmin, putController)
productsRouter.delete('/:id', onlyLoggedRest, isPremiumOrAdmin, deleteController) 
