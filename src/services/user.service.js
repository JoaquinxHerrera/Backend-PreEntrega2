import { usersDao } from "../daos/users/users.dao.mongodb.js";
import { User } from "../models/users.model.js";
import { hashear } from "../utils/criptografia.js";
import { emailService } from "./email/email.service.js";

class UserService{
    async createUser(data){
        try {
            if (data.password) {
              data.password = await hashear(data.password)
            }
            delete data.rol
      
            const user = new User(data)
      
            await usersDao.createOne(user.toPojo())
      
            await emailService.send(user.email, 'bienvenida', 'gracias por registrarse!')

            return user.toPojo()
        } catch (error) {
            const typedError = new Error(error.message)
            typedError['type'] = 'INVALID_ARGUMENT'
            throw typedError
        }
    }
    async getUsers(){
        return await usersDao.readMany({})
    }
    async getUserById(query){
        const userById = await usersDao.readOne(query)
        return userById
    }
    async updateOne(id, data){
        return await usersDao.updateOne(id, data)
    }
    async deleteOne(id){
        return await usersDao.deleteOne(id)
    }
}

export const userService = new UserService()