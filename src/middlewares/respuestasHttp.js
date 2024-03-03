export const respuestasHttp = (req, res, next) =>{
    res['jsonOk'] = (payload) => {
        res.json({status: 'success', payload})
    }
    res['jsonError'] = (error) => {
        res.json({ status: 'error', message: error.message, error})
    }
    next()
}