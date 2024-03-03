import { Router } from "express";
import { deleteUserController, getUserController, postUserController, putUserController } from "../../controllers/user.controller.js";
import { authenticateWithJwt } from "../../middlewares/authentication.js";
import { onlyLoggedRest, soloRoles } from "../../middlewares/authorization.js";
import { tokenizeUserInCookie } from "../../middlewares/tokens.js";
import { hashear } from "../../utils/criptografia.js";

export const usuariosRouter = Router()

usuariosRouter.post('/', 
    postUserController,
    tokenizeUserInCookie,
    (req, res) =>{res['jsonOk'](req['user'])}
)
usuariosRouter.get('/current',
    // passport.authenticate('jwt', {failWithError: true, session: false}),
    authenticateWithJwt,
    async(req, res, next) => {res['jsonOk'](req.user)}
)
usuariosRouter.get('/',
    // passport.authenticate('jwt', {failWithError: true, session: false}),
    authenticateWithJwt,
    soloRoles(['admin']),
    getUserController,
)
usuariosRouter.put('/', putUserController)
usuariosRouter.delete('/', deleteUserController)
