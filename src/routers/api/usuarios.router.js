import { Router } from "express";
import { userManager } from "../../models/User.js";

export const usuariosRouter = Router()

usuariosRouter.post('/', async (req,res)=>{
    try{
        const user = await userManager.create(req.body)
        res.status(201).json({status:'success', payload:user.toObject()})
    } catch (error){
        res.status(400).json({status: 'error', message: error.message})
    }

})