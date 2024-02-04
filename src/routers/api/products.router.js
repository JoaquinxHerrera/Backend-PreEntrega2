import { Router } from "express";

import axios from 'axios';
import { deleteController, getController, getIdController, postController, putController } from "../../controllers/products.controller.js";

export const productsRouter = Router()

productsRouter.get('/', getController)
productsRouter.get('/:id', getIdController)
productsRouter.post('/', postController)
productsRouter.put('/:id', putController)
productsRouter.delete('/:id', deleteController)
