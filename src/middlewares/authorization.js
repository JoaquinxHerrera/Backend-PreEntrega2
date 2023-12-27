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
        return res.redirect('/login')
    }
    next()
}