import passport from "passport"
import { userService } from "../services/index.js"


import { hashear } from "../utils/criptografia.js"

export async function postUserController(req, res, next){
    try {
        req.body.password = hashear(req.body.password)
        const user = await userService.createUser(req.body)
        res.status(201).json({status: 'success', payload: user})
        // req.user = user
        // next()
    } catch (error) {
        // next(error)
        res.status(400).json({message:error.message})
    }
}

export async function getUserController(req, res, next){
    passport.authenticate("jwt", { failWithError: true })(req, res, next);
    return res.json({ status: "success", payload: req.user });
    // try {
    //     const users = await userService.getUsers()
    //     res.json(users)
    // } catch (error) {
    //     next(error)
    // }
}

export async function putUserController(req, res){
    try {
        if(req.body.password){
            req.body.password = hashear(req.body.password)
        }

        const updated = await userService.updateOne(
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

export async function switchRolController(req, res){
    const {uid} = req.params;
    const user = await userService.getUserById({_id: uid});

    try{
        if(user.rol === "user"){
            user.rol = "premium"
        }else if(user.rol === "premium"){
            user.rol = 'user'
        }

        const updated = await userService.updateOne(uid, {
            $set: {rol : user.rol},
        })

        return res.status(200).json({status: 'success', payload: updated})

    }catch(error){
        res.status(404).json({status: "error", message: error.message})
    }
}

export async function resetPasswordController(req, res){
    try {
        console.log("Reset password controller called");
        const {uid} = req.params;
        const newPassword = req.body.newPassword;
        console.log("New password received:", newPassword);
        if (!newPassword) {
            return res.status(400).json({ error: "New password is required" });
        }
        const hashedPassword = hashear(newPassword);
        console.log("Hashed password:", hashedPassword);
        const updatedUser = await userService.updateOne(uid, {password: hashedPassword})

        if(!updatedUser){
            return res.status(404).json({status: "error", message: "user not found"})
        }
        res.status(200).json({message: 'Password updated successfully'})
    } catch (error) {
        console.error("Failed to update the password", error);
        res.status(500).json({error: "Failed to update the password"})
    }
}