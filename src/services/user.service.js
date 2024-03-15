export class UserRepository{
    constructor(dao){
        this.dao = dao;
    }
    async createUser(data){
        const user = await this.dao.create(data)
        return user;
        // try {
        //     if (data.password) {
        //       data.password = await hashear(data.password)
        //     }
        //     delete data.rol
      
        //     const user = new User(data)
      
        //     await this.dao.createOne(user.toPojo())
      
        //     await emailService.send(user.email, 'bienvenida', 'gracias por registrarse!')

        //     return user.toPojo()
        // } catch (error) {
        //     const typedError = new Error(error.message)
        //     typedError['type'] = 'INVALID_ARGUMENT'
        //     throw typedError
        // }
    }
    async getUsers(){
        return await this.dao.readMany({})
    }
    async getUserById(query){
        const userById = await this.dao.readOne(query)
        return userById
    }
    async updateOne(id, query){
        return await this.dao.updateOne(id, query)
    }
    async deleteOne(id){
        return await this.dao.deleteOne(id)
    }
}

