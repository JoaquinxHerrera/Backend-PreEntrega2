import { userDaoMongoose } from "../daos/users/user.dao.mongoose.js";
import { newError, NotFoundError } from "../errors/errors.js";

class UserService{
    async createUser(data){
        const user = await userDaoMongoose.create(data)
        return user
    }
    async getUsers(){
        return await userDaoMongoose.readMany({})
    }
    async getUserById(query){
        const userById = await userDaoMongoose.readOne(query)
        if(!userById) throw NotFoundError('user not found')
        return userById
    }
    async updateOne(id, data){
        return await userDaoMongoose.updateOne(id, data)
    }
    async deleteOne(id){
        const user = await this.userDaoMongoose(deleteOne(id))
        if(!user) throw NotFoundError('user not found')
        return user
    }
}

export const userService = new UserService()