import { Router } from "express";
import passport from "passport";
import { sessionsPost } from "../../controllers/sessions.controller.js";
import { onlyLoggedRest } from "../../middlewares/authorization.js";
import { deleteTokenFromCookie, tokenizeUserInCookie } from "../../middlewares/tokens.js";

export const sesionesRouter = Router()

sesionesRouter.post('/', 
    sessionsPost,
    tokenizeUserInCookie,
    (req, res) => {res['created'](req['user'])}  
);

sesionesRouter.get('/current', onlyLoggedRest,(req, res)=>{
    res.json(req.user)

})

sesionesRouter.delete('/current',
    deleteTokenFromCookie,
    (req,res)=>{res['ok']()}
);