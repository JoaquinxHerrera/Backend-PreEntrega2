import { Router } from "express";

export const usuariosRouter = Router()

usuariosRouter.get('/register', function(req,res){
    res.render('register.handlebars', {pageTitle: 'Register'})
})

usuariosRouter.get('/resetpassword', function(req,res){
    res.render('resetpassword.handlebars', {pageTitle: 'Reset Password'})
})

usuariosRouter.get('/profile', function(req,res){
    res.render('profile.handlebars', {pageTitle: 'Profile', user: req.user})
})

usuariosRouter.get('/edit', function(req,res){
    res.render('edit.handlebars', {pageTitle: 'Edit my info'})
})