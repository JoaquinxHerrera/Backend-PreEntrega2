import passport from "passport";
import { Strategy as LocalStrategy} from "passport-local";
import {Strategy as GithubStrategy} from "passport-github2"
import { GITHUB_CALLBACK_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "../config.js";
import { userManager } from "../models/User.js";


passport.use('loginLocal', new LocalStrategy({
    usernameField: 'email'}, 
    async function verificationCallback(username, password, done) {
    try {
        const userData = await userManager.login(username, password)
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
        let user = await userManager.findOne({email: profile.username})
        if(!user){
            await userManager.create({
                name: profile.displayName,
                email: profile.username,
            })
        }
        done(null, user)
}))

//esto va por defecto
passport.serializeUser((user, next) => {next(null, user)})
passport.deserializeUser((user, next) => {next(null, user)})

export const passportInitialize = passport.initialize()
export const passportSession = passport.session()