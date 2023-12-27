import { Router } from "express";
import { onlyLoggedRest } from "../../middlewares/authorization.js";
import { userManager } from "../../models/User.js";
import { hashear } from "../../utils/criptografia.js";

export const usuariosRouter = Router()

usuariosRouter.post('/', async(req,res)=>{
    try{
        req.body.password = hashear(req.body.password)

        const user = await userManager.create(req.body)

        req.login(user.toObject(), error =>{
            if(error){
                res.status(401).json({status: 'error', message: error.message})
            } else{
                res.status(201).json({status:'success', payload: user.toObject()})
            }
        })
        
    } catch(error){
        res.status(400).json({status: 'error', message: error.message})
    }
})

usuariosRouter.get('/current', onlyLoggedRest, async(req,res)=>{
    // @ts-ignore
    const user = await userManager.findOne({email: req['user'].email}, {password: 0}).lean()
    res.json({status:'success', payload: user})
})

usuariosRouter.put('/', async function(req, res){
    try{

        if(req.body.password){
            req.body.password = hashear(req.body.password) 
        }
        
        const updated = await userManager.updateOne(
            {email: req.body.email},
            {$set: req.body},
            {new: true}
        )

        if(!updated){
            return res.status(404).json({status: 'error', message: 'User not found'})
        }
        res.json({status: 'success', payload: updated})
    } catch(error){
        res.status(400).json({status: 'error', message: error.message})
    }
})