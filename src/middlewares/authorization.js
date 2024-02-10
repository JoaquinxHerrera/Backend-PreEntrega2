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