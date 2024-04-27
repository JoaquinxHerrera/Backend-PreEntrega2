import passport from "passport"
import { UsersDaoMongoose } from "../daos/users/users.dao.mongoose.js"
import { appendJwtAsCookie } from "../middlewares/authentication.js"
import { userService } from "../services/index.js"
import { hashear } from "../utils/criptografia.js"

export async function postUserController(req, res, next){
    try {
        if (!req.body.email) {
            return res.status(400).json({ status: 'error', message: 'Email is required' });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ status: 'error', message: 'Invalid email format' });
        }
        req.body.password = hashear(req.body.password)
        const user = await userService.createUser(req.body)
        res.status(201).json({status: 'success', message: 'Account created successfully, now you have to login', payload: user})
    } catch (error) {
        next(error)
    }
    appendJwtAsCookie
}

export async function getUserController(req, res, next){
    passport.authenticate("jwt", { failWithError: true });
    try {
        const users = await userService.getUsers()
        res.json(users)
    } catch (error) {
        next(error)
    }
}

export async function getCurrentUser(req, res, next){
    passport.authenticate("jwt", { failWithError: true });
    try {
        req.app.on('userUpdated', async (updatedUser) => {

            const updatedUserData = await userService.getUserById({_id: updatedUser._id});
            res.json({status: "success", payload: updatedUserData});
        });

        res.json({status: "success", payload: req.user});
    } catch (error) {
        next(error);
    }
}

export async function putUserController(req, res){
    try {
        if(req.body.cart || req.body.last_connection || req.body.rol){
            return res.status(400).json({
                status: 'error',
                message: 'That information cannot be updated'
            })
        }

        if (req.body.password) {
            req.body.password = hashear(req.body.password);
          }

        const userId = req.user._id 
        // si uso esto no me sirve el restore mail del login porque no puedo usar el put sin haberme logeado antes porque le faltaria el id 

        const updated = await userService.updateOne(
            {_id: userId},
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
    let userId = req.user._id;

    if(req.user.rol === 'admin' && req.params.uid){
        userId = req.params.uid
    }

    console.log("ID del usuario a eliminar:", userId);
    try {
        const result = await userService.deleteOne(userId)
        res.status(200).json({status: 'success', payload: result})
    } catch (error) {
        res.status(400).json({status: 'error', message: error.message})
    }
}
export async function deleteInactiveController(req, res, next){
    try {
        const currentDate = new Date();
        const limitDate = new Date(currentDate);
        limitDate.setHours(limitDate.getHours() - 48)

        const deletionResult = await userService.deleteMany({ last_connection: { $lt: limitDate } });

        if (deletionResult.success) {
            res.status(200).json({ message: 'Inactive users deleted successfully' });
        } else {
            res.status(500).json({ message: 'Failed to delete inactive users' });
        }
    } catch (error) {
        next(error)
    }
}

export async function switchRolController(req, res, next){
    const {uid} = req.params
    const user = await userService.getUserById({_id: uid});

    try{
        if(user.rol === "user"){
            user.rol = "premium"
        }else if(user.rol === "premium"){
            user.rol = 'user'
        }

        const updated = await userService.updateOne(uid, {$set: {rol : user.rol}})
        return res.status(200).json({status: 'success, login again to reflect changes', payload: updated})

    }catch(error){
        next(error)
    }
}

export async function resetPasswordController(req, res){
    try {
        console.log("Reset password controller called");
        const newPassword = req.body.newPassword;
        console.log("New password received:", newPassword);
        if (!newPassword) {
            return res.status(400).json({ error: "New password is required" });
        }
        
        const hashedPassword = hashear(newPassword);
        console.log("Hashed password:", hashedPassword);
        const updatedUser = await userService.updateOne(req.user._id, {password: hashedPassword})

        if(!updatedUser){
            return res.status(404).json({status: "error", message: "user not found"})
        }
        res.status(200).json({message: 'Password updated successfully'})
    } catch (error) {
        console.error("Failed to update the password", error);
        res.status(500).json({error: "Failed to update the password"})
    }
}

