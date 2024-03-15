export class CartRepository {
    constructor(dao){
        this.dao = dao;
    }
    async createCart(data){
        const cart = await this.dao.create(data)
        return cart
    }
    async getCarts(){
        return await this.dao.readMany({})
    }
    async getCartById(id){
        const cartById = await this.dao.readOne(id)
        return cartById
    }
    async updateOneCart(id, data){
        return this.dao.updateOne(id, data)
    }
    async deleteOneCart(id){
        return this.dao.deleteOne(id)
    }
}

