export const PORT = 8080
export const MONGODB_CNX_STR = 'mongodb+srv://joacoherrera98:PreEntrega2@cluster0.a33vlyl.mongodb.net/'
export const SESSION_SECRET = 'SecretSession'

export const GITHUB_APP_ID = 750850
export const GITHUB_CLIENT_ID = 'Iv1.354c4c6215adc415'
export const GITHUB_CLIENT_SECRET = 'a4977b95ea1aeeedfaa61456c28d812243273878'
export const GITHUB_CALLBACK_URL= 'http://localhost:8080/githubcallback'

export const MODO_EJECUCION = 'online'

export const JWT_SECRET = 'secreto'
export const COOKIE_SECRET = 'cookieSecret'
export const COOKIE_OPTS = {
    signed: true,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
};

export const ADMIN_EMAIL = 'adminCoder@coder.com'

export const DEFAULT_ROLE = 'user'

export const MODE = process.env.MODE || 'development'

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