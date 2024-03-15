import { COOKIE_OPTS } from "../config/config.js";
import { decrypt, encrypt } from "../utils/criptografia.js";

export async function tokenizeUserInCookie (req, res, next){
    try{
        const token = await encrypt(req.user.toObject())
        req.user.token = token;
        res.cookie('auth', token, COOKIE_OPTS)
        next()
    }catch(error){
        next(error)
    }
}

export async function extractTokenFromCookie(req, res, next){
    const sCookie = req.signedCookies.auth
    if(sCookie){
        const tokenDecrypt = await decrypt(sCookie)
        req.user = tokenDecrypt
    }
    next()
}

export function deleteTokenFromCookie(req, res, next){
    res.clearCookie('authorization', COOKIE_OPTS)
    next()
}