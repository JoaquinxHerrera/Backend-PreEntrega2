export function onlyLoggedRest (req, res, next){
    if (!req.session['user']){
        return res
            .status(403)
            .json({
                status: 'error',
                message: 'Not enough rights, only for logged users'
            })
    }
    next()
}

export function onlyLoggedWeb (req, res, next){
    if (!req.session['user']){
        return res.redirect('/login')
    }
    next()
}