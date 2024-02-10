import { Router } from "express";
import { deleteUserController, getUserController, postUserController, putUserController } from "../../controllers/user.controller.js";
import { onlyLoggedRest } from "../../middlewares/authorization.js";
;

export const usuariosRouter = Router()

usuariosRouter.post('/', postUserController)
usuariosRouter.get('/current', onlyLoggedRest, getUserController)
usuariosRouter.put('/', putUserController)
usuariosRouter.delete('/', deleteUserController)
