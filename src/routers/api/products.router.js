import { Router } from "express";
import axios from 'axios';
import { deleteController, getController, getIdController, postController, putController } from "../../controllers/products.controller.js";
import { soloRoles } from "../../middlewares/authorization.js";

export const productsRouter = Router()

productsRouter.get('/', getController)
productsRouter.get('/:id', getIdController)
productsRouter.post('/', soloRoles(['premium']),  postController)
productsRouter.put('/:id',soloRoles(['premium']), putController)
productsRouter.delete('/:id',soloRoles(['premium']), deleteController)
