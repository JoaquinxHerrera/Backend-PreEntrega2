import passport from "passport";
import { Strategy as LocalStrategy} from "passport-local";
import {Strategy as GithubStrategy} from "passport-github2"
import { COOKIE_OPTS, GITHUB_CALLBACK_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, JWT_SECRET } from "../config/config.js";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { encrypt } from "../utils/criptografia.js";
import { userService } from "../services/index.js";
import { UsersDaoMongoose, usersManager } from "../daos/users/users.dao.mongoose.js";



export async function appendJwtAsCookie(req, res, next){
    try{
        const token = await encrypt(req.user)
        req.user.token = token
        res.cookie('auth', token, COOKIE_OPTS)
        next()
    } catch(error){
        next(error)
    }
}

export async function removeJwtFromCookies(req, res, next){
    res.clearCookie('auth', COOKIE_OPTS)
    next()
}

passport.use('localRegister', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
},
    async (req, _u, _p, done)=>{
        try {
            const userData = await usersManager.register(req.body)
            done(null, userData)
        } catch (error) {
            done(null, false, error.message)
        }
    }
))

passport.use('loginLocal', new LocalStrategy({
    usernameField: 'email'
    }, 
    async function verificationCallback(email, password, done) {
    try {
        const userData = await usersManager.login(email, password)
        done(null, userData)
    } catch (error) {
        done(error)
    }
}))
passport.use('loginGithub', new GithubStrategy({
    clientID: GITHUB_CLIENT_ID, 
    clientSecret: GITHUB_CLIENT_SECRET, 
    callbackURL: GITHUB_CALLBACK_URL
    }, async (_, __, profile, done) => {
        let user = await userService.getUserById({
            email: profile.displayName,
        });
        if (!user) {
          user = await userService.createUser({
            email: profile.email,
            first_name: profile.displayName,
          });
        }
        done(null, user);
}))

//esto va por defecto
passport.serializeUser((user, next) => {next(null, user)})
passport.deserializeUser((user, next) => {next(null, user)})

export const passportInitialize = passport.initialize();
export const passportSession = passport.session();




passport.use("jwt", new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([function (req) {
          let token = null;
          if (req?.signedCookies) {
            token = req.signedCookies["auth"];
          }
          return token;
        },
      ]),
      secretOrKey: JWT_SECRET,
    },
    function loginUser(user, done) {
      // console.log(user)
      done(null, user);
    }
  )
);

export async function authenticate(req, res, next) {
    if (!req.token) {
      return res.status(401).json({
        error: "no access token provided",
      });
    }
  
    try {
      const decoded = await decrypt(req.token);
      req.user = decoded;
  
      next();
    } catch (error) {
      res.status(401).json({
        error: "authentication failed",
      });
    }
}

export async function authenticateWithJwt(req, res, next) {
  passport.authenticate('jwt', { failWithError: true, session: false })(req, res, error => {
    if (error) {
      const typedError = new Error('error de autenticacion')
      typedError['type'] = 'FAILED_AUTHENTICATION'
      next(typedError)
    } else {
      next()
    }
  })

}

export const authentication = passport.initialize()



