import { Router } from "express";

export const webRouter = Router()

webRouter.get('/', async(req,res)=>{
    res.redirect('/api/products')
})