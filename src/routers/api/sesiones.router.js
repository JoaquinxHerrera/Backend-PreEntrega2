import { Router } from "express";
import passport from "passport";
import { onlyLoggedRest } from "../../middlewares/authorization.js";

export const sesionesRouter = Router()

sesionesRouter.post('/', 
    passport.authenticate('loginLocal',{
        failWithError: true
    }),
    async(req,res, next)=>{
        res.status(201).json({status: 'success', message: 'Login success'})
    },
    (error,req,res,next)=> {
        res.status(401).json({status:'error', message: error.message})
    }    
);

sesionesRouter.get('/current', onlyLoggedRest,(req, res)=>{
    res.json(req.user)

})

sesionesRouter.delete('/current', (req,res)=>{
    req.session.destroy(err =>{
        if (err){
            return res.status(500).json({status: 'logout error', body: err});
        }
        res.json({status: 'success', message: 'Success log out'});
    });
});