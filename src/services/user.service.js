export class UserRepository{
    constructor(dao){
        this.dao = dao;
    }
    async createUser(data){
        const user = await this.dao.create(data)
        return user;

    }
    async getUsers(){
        return await this.dao.readMany({})
    }
    async getUserById(query){
        const userById = await this.dao.readOne(query)
        return userById
    }
    async updateOne(id, query){
        return this.dao.updateOne(id, query)
    }
    async deleteOne(id){
        try {
            const deletedUser = await this.dao.deleteOne(id);
            if(!deletedUser) {
                return {message: 'User not found'}
            }
            return {message: 'User deleted successfully'}
        } catch (error) {
            throw error;
        }
        
    }
    async deleteMany(query){
        try{
            const deletedUsers = await this.dao.deleteMany(query)
            return {success: true, message: `${deletedUsers.length} users deleted`}
        } catch (error){
            logger.info('Error deleting users:', error)
            throw error
        }
    }
}

