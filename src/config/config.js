import dotenv from 'dotenv'

dotenv.config()

export const PORT = 8080
export const MONGODB_CNX_STR = 'mongodb+srv://joacoherrera98:PreEntrega2@cluster0.a33vlyl.mongodb.net/'
export const SESSION_SECRET = 'SecretSession'

export const GITHUB_APP_ID = process.env.GITHUB_APP_ID
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
export const GITHUB_CALLBACK_URL= 'http://localhost:8080/githubcallback'

export const MODO_EJECUCION = 'online'

export const JWT_SECRET = process.env.JWT_SECRET
export const COOKIE_SECRET = process.env.COOKIE_SECRET
export const COOKIE_OPTS = {
    signed: true,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
};

export const ADMIN_EMAIL = 'adminCoder@coder.com'

export const DEFAULT_ROLE = 'user'
export const EMAIL_USER = process.env.EMAIL_USER || 'test email user'
export const EMAIL_PASS = process.env.EMAIL_PASS

export const SWAGGER_CONFIG = {
    definition: {
      openapi: '3.0.1',
      info: {
        version: '1',
        title: 'Swagger Demo',
        description: 'Demo de swagger para coderhouse'
      }
    },
    apis: ['./docs/**/*.yaml']
  }