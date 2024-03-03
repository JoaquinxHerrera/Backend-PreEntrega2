import passport from "passport";
import { Strategy as JwtStrategy } from 'passport-jwt'
import { JWT_PRIVATE_KEY } from "../config.js";
// import { Strategy as LocalStrategy} from "passport-local";
// import {Strategy as GithubStrategy} from "passport-github2"
// import { GITHUB_CALLBACK_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "../config.js";
// import { User } from "../daos/users/user.dao.mongoose.js";



// export const  initializePassport = (app) =>{
//     passport.use('loginLocal', new LocalStrategy({
//         usernameField: 'email'}, 
//         async function verificationCallback(username, password, done) {
//         try {
//             const userData = await User.login(username, password)
//             done(null, userData)
//         } catch (error) {
//             done(error)
//         }
//     }))

//     passport.use('loginGithub', new GithubStrategy({
//         clientID: GITHUB_CLIENT_ID, 
//         clientSecret: GITHUB_CLIENT_SECRET, 
//         callbackURL: GITHUB_CALLBACK_URL
//         }, async (_, __, profile, done) => {
//             let user = await User.findOne({email: profile.username})
//             if(!user){
//                 await User.create({
//                     name: profile.displayName,
//                     email: profile.username,
//                 })
//             }
//             done(null, user)
//     }))

//     //esto va por defecto
//     passport.serializeUser((user, next) => {next(null, user)})
//     passport.deserializeUser((user, next) => {next(null, user)})

//     app.use(passport.initialize())
//     app.use(passport.session())

// }

passport.use('jwt', new JwtStrategy(
    {
        jwtFromRequest: function (req) {
            var token = null
            if(req && req['signedCookies'] && req['signedCookies']['authorization']){
                token = req['signedCookies']['authorization']
            }
            return token
        },
        secretOrKey: JWT_PRIVATE_KEY
    },
    (user,done)=>{
        done(null,user)
    }
))

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
