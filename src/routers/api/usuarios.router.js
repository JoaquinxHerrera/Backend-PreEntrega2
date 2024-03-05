import { Router } from "express";
import passport from "passport";
import { deleteUserController, getUserController, postUserController, putUserController } from "../../controllers/user.controller.js";
import { appendJwtAsCookie, authenticateWithJwt } from "../../middlewares/authentication.js";
import { onlyLoggedRest } from "../../middlewares/authorization.js";
import { tokenizeUserInCookie } from "../../middlewares/cookies.js";
;

export const usuariosRouter = Router()

usuariosRouter.post('/', 
    postUserController,
    tokenizeUserInCookie,
    (req, res) => { res['jsonOk'](req['user']) }
)
usuariosRouter.get('/current', 
    //@ts-ignore
    // passport.authenticate('jwt', { failWithError: true, session: false }),
    authenticateWithJwt,
    async (req, res, next) => { res['jsonOk'](req['user']) }
)
usuariosRouter.get('/',
    //@ts-ignore
    // passport.authenticate('jwt', { failWithError: true, session: false }),
    authenticateWithJwt,
    soloRoles(['admin']),
    getUserController
)
usuariosRouter.put('/', putUserController)
usuariosRouter.delete('/', deleteUserController)
