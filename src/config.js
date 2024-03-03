import 'dotenv/config'

export const PORT = 8080
export const MONGODB_CNX_STR = process.env.MONGODB_CNX_STR || ''
export const SESSION_SECRET = 'SecretSession'

export const GITHUB_APP_ID = 750850
export const GITHUB_CLIENT_ID = 'Iv1.354c4c6215adc415'
export const GITHUB_CLIENT_SECRET = 'a4977b95ea1aeeedfaa61456c28d812243273878'
export const GITHUB_CALLBACK_URL= 'http://localhost:8080/githubcallback'

export const JWT_PRIVATE_KEY= process.env.JWT_PRIVATE_KEY || ''
export const COOKIE_SECRET=process.env.COOKIE_SECRET || ''

export const DEFAULT_ROLE='user'

export const MODE = process.env.MODE || 'development'

export const EMAIL_USER = process.env.EMAIL_USER  || 'test email user'
export const EMAIL_PASS = process.env.EMAIL_PASS

export const MODO_EJECUCION = 'online'