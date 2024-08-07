import { decrypt } from "../utils/criptografia.js"

// export function onlyLoggedWeb (req, res, next){
//     if (!req.isAuthenticated()){
//         return res
//             .redirect('/unauthorized');
        
//     }
//     next();
// }
export function onlyLoggedWeb(req, res, next) {
    if (!req.user) {
        res.redirect('/login?error=You must log in first');
    } else {
        next();
    }
}
export function onlyLoggedRest (req, res, next){
    if (!req.isAuthenticated()){
        return res
            .status(403)
            .json({
                status: 'error',
                message: 'You need to login'
            })
        
    }
    next();
}

export function isAdmin(req, res, next){
    if( req.user.rol === 'admin'){
        return next()
    }else{
        return res.status(403).json({message: 'Unauthorized'})
    }
}

export function isLogged(req, res, next){
    if( req.user.rol !== 'user' && req.user.rol !== "premium" && req.user.rol !== 'admin'){
        return res.status(403).json({message: 'You need to be logged in'})
    }
    
}
export function isPremium(req, res, next) {
    if (req.user.rol === "premium") {
        return next()
    }else{
        return res.status(403).json({message: 'You need to be logged as premium user'})
    }
}

export function isPremiumOrAdmin(req, res, next){
    if( req.user.rol !== 'premium' && req.user.rol !== "admin"){
        return res.status(403).json({message: 'You need to be logged as premium or admin'})
    }else{
        return next()
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

export function soloRoles(roles) {
    return async function (req, res, next) {
      if (roles.includes(req.user.rol)) {
        return next()
      }
      const typedError = new Error('special permission needed')
      typedError['type'] = 'FAILED_AUTHORIZATION'
      next(typedError)
    }
}