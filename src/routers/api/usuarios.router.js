import { Router } from "express";
import passport from "passport";
import { deleteInactiveController, deleteUserController, getCurrentUser, getUserController, postUserController, putUserController, resetPasswordController, switchRolController } from "../../controllers/user.controller.js";
import { appendJwtAsCookie, authenticateWithJwt } from "../../middlewares/authentication.js";
import {authenticate, isAdmin, onlyLoggedRest, soloRoles } from "../../middlewares/authorization.js";
import { extractTokenFromCookie, tokenizeUserInCookie } from "../../middlewares/cookies.js";
;

export const usuariosRouter = Router()

usuariosRouter.post('/', postUserController)
usuariosRouter.get('/current', onlyLoggedRest, passport.authenticate('jwt', { session: false }), getCurrentUser)
usuariosRouter.get('/',
    //@ts-ignore
    passport.authenticate('jwt', { failWithError: true, session: false }),
    isAdmin,
    getUserController
)
usuariosRouter.put('/', onlyLoggedRest,putUserController)
usuariosRouter.put('/resetpassword/',
    onlyLoggedRest,
    extractTokenFromCookie,
    resetPasswordController
)
usuariosRouter.put('/premium/:uid', onlyLoggedRest, switchRolController)
usuariosRouter.delete('/', onlyLoggedRest, authenticateWithJwt, deleteUserController)
usuariosRouter.delete('/:uid?',passport.authenticate('jwt', { failWithError: true, session: false }), isAdmin, authenticateWithJwt, deleteUserController)

