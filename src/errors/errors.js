
export function newError(type, message){
    const error = new Error(message)
    error.name = type
    return error
}

export class NotFoundError extends Error{
    constructor(message){
        super(message)
        this.name = ErrorType.NOT_FOUND
    }
}
export class InvalidDataError extends Error{
    constructor(message){
        super(message)
        this.name = ErrorType.INVALID_DATA
    }
}
export class AuthenticationError extends Error{
    constructor(message){
        super(message)
        this.name = ErrorType.AUTHENTICATION_ERROR
    }
}
export class ValidationError extends Error{
    constructor(message){
        super(message)
        this.name = ErrorType.VALIDATION_ERROR
    }
}
export class UnauthorizedError extends Error{
    constructor(message){
        super(message)
        this.name = ErrorType.UNAUTHORIZED_ERROR
    }
}


export const ErrorType = {
    NOT_FOUND: 'NOT_FOUND',
    INVALID_DATA: 'INVALID_DATA',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    UNAUTHORIZED_ERROR: 'UNAUTHORIZED_ERROR',
}
