import { usersDao } from "../daos/users/users.dao.mongodb.js"
import { User } from "../models/User.js"
import { hasheadasSonIguales, hashear } from "../utils/criptografia.js"


class UserService{
    async createUser(data){
        try {
            if(data.password){
                data.password = hashear(data.password)
            }
            delete data.rol

            const user = new User(data)

            await usersDao.createOne(user.toPojo())

            return user.toPojo()
        } catch (error) {
            const typedError = new Error(error.message)
            typedError['type'] = 'INVALID_ARGUMENT'
            throw typedError
        }
    }
    async getUsers(){
        return await userDaoMongoose.readMany({})
    }
    async getUserById(query){
        const userById = await userDaoMongoose.readOne(query)
        return userById
    }

    async autenticar({email, password}){
        const user = await usersDao.readOne({ email })
        if (!user) {
        const typedError = new Error('error de autenticacion')
        typedError['type'] = 'FAILED_AUTHENTICATION'
        throw typedError
        }
        if (!hasheadasSonIguales(password, user.password)) {
        const typedError = new Error('error de autenticacion')
        typedError['type'] = 'FAILED_AUTHENTICATION'
        throw typedError
        }
        return user
    }

    async updateOne(id, data){
        return await userDaoMongoose.updateOne(id, data)
    }
    async deleteOne(id){
        return await userDaoMongoose.deleteOne(id)
    }
}

export const userService = new UserService()