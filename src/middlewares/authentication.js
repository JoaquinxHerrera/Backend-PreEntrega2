import passport from "passport";
import { Strategy as LocalStrategy} from "passport-local";
import {Strategy as GithubStrategy} from "passport-github2"
import { COOKIE_OPTS, GITHUB_CALLBACK_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, JWT_SECRET } from "../config.js";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { encrypt } from "../utils/criptografia.js";
import { usersDao } from "../daos/users/users.dao.mongodb.js";

export async function appendJwtAsCookie(req, res, next){
    try{
        const token = await encrypt(req.user)
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
            const userData = await usersDao.register(req.body)
            done(null, userData)
        } catch (error) {
            done(null, false, error.message)
        }
    }
))

passport.use('loginLocal', new LocalStrategy({
    usernameField: 'email'
    }, 
    async function verificationCallback(username, password, done) {
    try {
        const userData = await usersDao.login(username, password)
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
        const user = await usersDao.findOne({email: profile.username})
        // if(!user){
        //     await User.create({
        //         name: profile.displayName,
        //         email: profile.username,
        //     })
        // }
        // done(null, user)
        if(user){ 
            return done(null, {
                ...user.publicInfo(),
                rol: 'user'
            })
        }

        try {
            const registered = await usersDao.register({
                first_name: profile.displayName,
                last_name: '(not specified)',
                email: profile.username,
                password: '(not specified)'
            })
            done(null, registered)
        } catch (error) {
            done(error)
        }
}))

//esto va por defecto
passport.serializeUser((user, next) => {next(null, user)})
passport.deserializeUser((user, next) => {next(null, user)})

export const passportInitialize = passport.initialize();
export const passportSession = passport.session();




passport.use("jwt", new JwtStrategy(
    {
      jwtFromRequest: function (req) {
        var token = null
        if (req && req['signedCookies'] && req['signedCookies']['authorization']) {
          token = req['signedCookies']['authorization']
        }
        return token
      },
      secretOrKey:  JWT_SECRET
    },
        (user, done) => {
        done(null, user)
    }
));

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



