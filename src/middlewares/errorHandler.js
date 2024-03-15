import { logger } from "../utils/logger.js"

export function errorHandler(error, req, res, next) {
    switch (error.type) {
        case 'INVALID_ARGUMENT':
          res.status(400)
          break
        case 'FAILED_AUTHENTICATION':
          res.status(401)
          break
        case 'FAILED_AUTHORIZATION':
          res.status(403)
          break
        case 'INTERNAL_ERROR':
          res.status(500)
          break
        default:
          res.status(500)
      }
      logger.error(`status ${res.status} - message: ${error.message}`);
      res.json({
        status: 'error',
        message: error.message
      })
}