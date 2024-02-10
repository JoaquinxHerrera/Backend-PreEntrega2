import { Router } from "express";
import { deleteController, getController, getIdController, postController, putController } from "../../controllers/products.controller.js";
import { isAdmin } from "../../middlewares/authorization.js";

export const productsRouter = Router()

productsRouter.get('/', getController)
productsRouter.get('/:id', getIdController)
productsRouter.post('/', isAdmin, postController)
productsRouter.put('/:id', isAdmin, putController)
productsRouter.delete('/:id', isAdmin, deleteController)
