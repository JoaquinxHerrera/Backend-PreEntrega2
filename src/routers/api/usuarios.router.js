import { Router } from "express";
import passport from "passport";
import { deleteUserController, getUserController, postUserController, putUserController } from "../../controllers/user.controller.js";
import { appendJwtAsCookie } from "../../middlewares/authentication.js";
import { onlyLoggedRest } from "../../middlewares/authorization.js";
;

export const usuariosRouter = Router()

usuariosRouter.post('/', postUserController)
usuariosRouter.get('/current', getUserController)
usuariosRouter.put('/', putUserController)
usuariosRouter.delete('/', deleteUserController)
