import { decrypt } from "../utils/criptografia.js"

export function onlyLoggedRest (req, res, next){
    if (!req.isAuthenticated()){
        return res
            .status(403)
            .json({
                status: 'error',
                message: 'You need to login'
            })
    }
    next()
}

export function onlyLoggedWeb (req, res, next){
    if (!req.isAuthenticated()){
        return res
            .status(403)
            .json({
                status: 'error',
                message: 'You need to login'
            })
    }
    next()
}

export function isAdmin(req, res, next){
    if( req.user.rol === 'admin'){
        return next()
    }else{
        return res.status(403).json({message: 'Unauthorized'})
    }
}

export function isUser(req, res, next){
    if( req.user.rol === 'user'){
        return next()
    }else{
        return res.status(403).json({message: 'You need to be logged in'})
    }
}

export async function authenticate(req, res, next){
    try{
        const userData = await decrypt(req['tokenDecrypt'])
        req.user = userData
        next()
    }catch(error){
        res.status(401).json({status:'error', message: 'auth filed, invalid token'})
    }
}