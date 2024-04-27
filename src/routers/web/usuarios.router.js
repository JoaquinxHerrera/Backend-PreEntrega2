import { Router } from "express";
import passport from "passport";
import { onlyLoggedWeb } from "../../middlewares/authorization.js";


export const usuariosRouter = Router()

usuariosRouter.get('/register', function(req,res){
    res.render('register.handlebars', {pageTitle: 'Register', ...req.user})
})//ok

usuariosRouter.get('/resetpassword', (req, res)=>{
    res.render('resetpassword.handlebars', {pageTitle: 'Reset Password', ...req.user})
})//ok
usuariosRouter.get('/verifyidentity', (req, res)=>{
    res.render('verifyIdentity.handlebars', {pageTitle: 'Reset Password', ...req.user})
})//ok

usuariosRouter.get('/profile', onlyLoggedWeb, function(req,res){
    res.render('profile.handlebars', {pageTitle: 'Profile', ...req.user})
})//ok

usuariosRouter.get('/unauthorized', (req, res)=>{
    res.render("unauthorized.handlebars", {title: "unauthorized"})
})


usuariosRouter.get('/edit', function(req,res){
    res.render('edit.handlebars', {pageTitle: 'Edit my info'})
})