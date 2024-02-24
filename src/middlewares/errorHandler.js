import { logger } from "../utils/logger.js"

export function errorHandler(error, req, res, next) {
    switch (error.name) {
        case ErrorType.BAD_REQUEST:
          res.status(400);
        case ErrorType.UNAUTHORIZED:
          res.status(401);
        case ErrorType.FORBIDDEN:
          res.status(403);
        case ErrorType.NOT_FOUND:
          res.status(404);
        default:
          res.status(500);
      }

    logger.error(`http error - status ${status} - message ${error.message} `)

    res.status(status).json({
        status: 'error',
        message: error.message
    })
}