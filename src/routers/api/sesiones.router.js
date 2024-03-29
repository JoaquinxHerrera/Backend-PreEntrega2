import { Router } from "express";
import passport from "passport";
import { userDTO } from "../../dto/user.dto.js";
import { appendJwtAsCookie, removeJwtFromCookies } from "../../middlewares/authentication.js";
import { onlyLoggedRest } from "../../middlewares/authorization.js";

export const sesionesRouter = Router()

sesionesRouter.post('/', 
    passport.authenticate('loginLocal',{failWithError: true, session: false}),
    appendJwtAsCookie,
    async(req,res)=>{
        console.log(req.user)
        res.status(201).json({status: 'success', message: 'Login success', user: req.user})
    },
    (error,req,res,next)=> {
        res.status(401).json({status:'error', message: error.message})
    }    
    
);

sesionesRouter.get("/current", 
  passport.authenticate('jwt', {failWithError: true}),
  function (req, res) { 
    return res.json(new userDTO(req.user))}
);

sesionesRouter.get("/githublogin", passport.authenticate("loginGithub"));

sesionesRouter.get("/githubcallback",
  passport.authenticate("loginGithub", {
    failWithError:true,
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  appendJwtAsCookie
);


sesionesRouter.delete('/current', 
  removeJwtFromCookies,
(req,res)=>{
  req.session.destroy(err =>{
      if (err){
          return res.status(500).json({status: 'logout error', body: err});
      }
      res.json({status: 'success', message: 'Success log out'});
  });
});