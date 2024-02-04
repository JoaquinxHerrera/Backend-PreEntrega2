import { userDaoMongoose } from "../daos/users/user.dao.mongoose.js";

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
        return userById
    }
    async updateOne(id, data){
        return await userDaoMongoose.updateOne(id, data)
    }
    async deleteOne(id){
        return await userDaoMongoose.deleteOne(id)
    }
}

export const userService = new UserService()