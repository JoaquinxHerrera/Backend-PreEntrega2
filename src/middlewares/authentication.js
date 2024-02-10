import passport from "passport";
import { Strategy as LocalStrategy} from "passport-local";
import {Strategy as GithubStrategy} from "passport-github2"
import { COOKIE_OPTS, GITHUB_CALLBACK_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, JWT_SECRET } from "../config.js";
import { User } from "../daos/users/user.dao.mongoose.js";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { encrypt } from "../utils/criptografia.js";

passport.use('loginLocal', new LocalStrategy({
    usernameField: 'email'}, 
    async function verificationCallback(username, password, done) {
    try {
        const userData = await User.login(username, password)
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
        let user = await User.findOne({email: profile.username})
        if(!user){
            await User.create({
                name: profile.displayName,
                email: profile.username,
            })
        }
        done(null, user)
}))

//esto va por defecto
passport.serializeUser((user, next) => {next(null, user)})
passport.deserializeUser((user, next) => {next(null, user)})

export const passportInitialize = passport.initialize();
export const passportSession = passport.session();


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
}

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

export const authentication = passport.initialize()



