import { userService } from "../services/user.service.js"

export const sessionsPost = async (req, res, next)=>{
    try {
        const user = await userService.autenticar(req.body)
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}