import { Router } from "express";
import passport from "passport";
import { deleteUserController, getUserController, postUserController, putUserController, resetPasswordController, switchRolController } from "../../controllers/user.controller.js";
import { appendJwtAsCookie, authenticateWithJwt } from "../../middlewares/authentication.js";
import {isAdmin, soloRoles } from "../../middlewares/authorization.js";
import { extractTokenFromCookie, tokenizeUserInCookie } from "../../middlewares/cookies.js";
;

export const usuariosRouter = Router()

usuariosRouter.post('/', postUserController)
usuariosRouter.get('/current', getUserController)
usuariosRouter.get('/',
    //@ts-ignore
    passport.authenticate('jwt', { failWithError: true, session: false }),
    authenticateWithJwt,
    isAdmin,
    getUserController
)//solo muestra el usuario que esta loggeado, osea el admin
usuariosRouter.put('/', putUserController)
usuariosRouter.put('/resetpassword/:uid',
    extractTokenFromCookie,
    resetPasswordController
)
usuariosRouter.put('/premium/:uid', switchRolController)//tenes que cerrar sesion para que se actualice el rol
usuariosRouter.delete('/', deleteUserController)
