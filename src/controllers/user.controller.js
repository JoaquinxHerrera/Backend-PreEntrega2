import passport from "passport"
import { User } from "../daos/users/user.dao.mongoose.js"
import { appendJwtAsCookie } from "../middlewares/authentication.js"
import { userService } from "../services/user.service.js"
import { hashear } from "../utils/criptografia.js"

export async function postUserController(req, res, next){
    try {
        req.body.password = hashear(req.body.password)
        const user = await userService.createUser(req.body)

        res.status(201).json({status: 'success', payload: user})
    } catch (error) {
        res.status(400).json({message: error.message})
    }

    appendJwtAsCookie

    // passport.authenticate('local-register', {
    //     failWithError: true,
    //     session:false
    // }),
    // appendJwtAsCookie,
    // async function (req, res) {
    //     res.status(201).json({status: 'success', payload: req.user})
    // }
    // try {
    //     req.body.password = hashear(req.body.password);
        
    //     const user = await userService.createUser(req.body);
    //     req.user = user
    //     res.result(user)
    // } catch (error) {
    //   next(error)
    // }
    // appendJwtAsCookie
}

export async function getUserController(req, res){
    passport.authenticate('jwt', {failWithError: true}),
    async (req, res)=>{
        res.json({status: 'success', payload: req.user})
    }

}

export async function putUserController(req, res){
    try {
        if(req.body.password){
            req.body.password = hashear(req.body.password)
        }

        const updated = await User.updateOne(
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