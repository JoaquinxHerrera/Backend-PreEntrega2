import { Router } from "express";
import passport from "passport";
import { sendResetEmailController } from "../../controllers/mails.controller.js";
import { userDTO } from "../../dto/user.dto.js";
import { appendJwtAsCookie, removeJwtFromCookies } from "../../middlewares/authentication.js";
import { userService } from "../../services/index.js";
import { logger } from "../../utils/logger.js";

export const sesionesRouter = Router()

sesionesRouter.post('/', 
    passport.authenticate('loginLocal',{failWithError: true}),
    appendJwtAsCookie,
    
    async(req,res)=>{
        logger.info(req.user)
        res.status(201).json({status: 'success', message: 'Login success', user: req.user})
    },
    (error,req,res,next)=> {
        res.status(401).json({status:'error', message: error.message})
    }    
    
);

sesionesRouter.get("/current", 
  passport.authenticate("jwt", { failWithError: true }),
  function (req, res) {
    logger.info(req.user);
    return res.json(new userDTO(req.user));
  }
);

sesionesRouter.get("/githublogin", passport.authenticate("loginGithub"));

sesionesRouter.get("/githubcallback",
  passport.authenticate("loginGithub", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
);


sesionesRouter.delete('/current', 
  removeJwtFromCookies,
  async (req,res)=>{
    try {
      await userService.updateOne(req.user._id,{$set: {last_connection: Date(Date.now).toLocaleString()}})
      req.session.destroy((err) =>{
          if (err){
              return res.status(500).json({status: 'logout error', body: err});
          }
          res.json({status: 'success', message: 'Success log out'});
      });
    } catch (error) {
      console.error(error)
      return res.status(500).json({error: error.message})
    }
  }
);

sesionesRouter.post('/resetpassword/:token',
  appendJwtAsCookie,
  passport.authenticate("jwt", {failWithError: true}),
  async (req, res) => {
    try {
      logger.info(req.user);
      return res.status(200).json({status: "success"})
    } catch (error) {
      console.log(error.message)
      return res.status(500).json({error: error.message})
    }
  }
)

