import passport from "passport"

import { usersDao } from "../daos/users/users.dao.mongodb.js"
import { appendJwtAsCookie } from "../middlewares/authentication.js"
import { userService } from "../services/user.service.js"
import { hashear } from "../utils/criptografia.js"

export async function postUserController(req, res, next){
    try {
        const user = await userService.createUser(req.body)
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}

export async function getUserController(req, res){
    try {
        const users = await userService.obtenerTodos()
        res.jsonOk(users)
    } catch (error) {
        next(error)
    }
}

export async function putUserController(req, res){
    try {
        if(req.body.password){
            req.body.password = hashear(req.body.password)
        }

        const updated = await usersDao.updateOne(
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
}

export async function deleteUserController(req, res){
    const id = req.params
    try {
        return await userService.deleteOne(id)
    } catch (error) {
        res.status(400).json({status: 'error', message: error.message})
    }
}