import winston from 'winston'

export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({level: 'debug'}),
        // new winston.transports.File({level: 'info'}),
        new winston.transports.File({level: 'error', filename: './logs/errors.log'})
    ]
})