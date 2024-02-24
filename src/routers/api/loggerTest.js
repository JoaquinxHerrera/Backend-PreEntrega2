import { Router } from "express"


export const loggerTest = Router()

loggerTest.get('/', (req, res)=>{
    req.logger.error('Alerta!')
    res.send({message: 'prubea de logger'})
})