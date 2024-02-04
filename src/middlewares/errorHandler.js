export function errorHandler(error, req, res, next) {
    res.status(400)
    res.json({ status: 'error', message: error.message })
}