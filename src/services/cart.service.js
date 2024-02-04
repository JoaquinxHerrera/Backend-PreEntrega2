import { cartsDaoMongoose } from "../daos/carts/cart.dao.mongoose.js";


class CartService {
    async createCart(data){
        const cart = await cartsDaoMongoose.create(data)
        return cart
    }
    async getCarts(){
        return await cartsDaoMongoose.readMany({})
    }
    async getCartById(id){
        const cartById = await cartsDaoMongoose.readOne(id)
        return cartById
    }
    async updateOneCart(id, data){
        return cartsDaoMongoose.updateOne(id, data)
    }
    async deleteOneCart(id){
        return cartsDaoMongoose.deleteOne(id)
    }
}

export const cartService = new CartService()