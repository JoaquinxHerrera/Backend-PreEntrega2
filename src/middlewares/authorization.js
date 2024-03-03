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

export function soloRoles(roles) {
    return async function (req, res, next) {
        if (req.user.rol === 'premium') {
            return next();
        }

        
        if (roles.some(role => req.user.rol === role)) {
            return next();
        }

       
        const typedError = new Error('special permission needed');
        typedError['type'] = 'FAILED_AUTHORIZATION';
        next(typedError);
    }
}