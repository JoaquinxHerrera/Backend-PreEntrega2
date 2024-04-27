import { Router } from "express";
import passport from "passport";

export const sesionesRouter = Router()

sesionesRouter.get('/login', function(req,res){
    res.render('login.handlebars', {pageTitle: 'Login'})
})//ok

sesionesRouter.get('/githublogin', passport.authenticate('loginGithub'))//ok
sesionesRouter.get('/githubcallback', passport.authenticate('loginGithub', {
    successRedirect: '/products',
    failureRedirect: '/login'
}))