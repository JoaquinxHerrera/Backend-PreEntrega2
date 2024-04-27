import { cartManager } from "../daos/carts/cart.dao.mongoose.js";

export class CartRepository {
    constructor(dao){
        this.dao = dao;
    }
    async createCart(ownerId = null){
        // const cartData = { owner: ownerId.toString() }; 
        const cartData = { owner: ownerId }; 
        const cart = await this.dao.create(cartData);
        return cart;
    }
    async getCarts(){
        return await this.dao.readMany({})
    }
    async getCartById(id){
        const cartById = await this.dao.readOne(id);
        return cartById;
    }
    async updateOneCart(id, data){
        return this.dao.updateOne(id, data)
    }
    async updateProductQuantity(cartId, productId, quantity){
        try {
            const updatedCart = await cartManager.findOneAndUpdate(
                {_id: cartId, "products._id": productId},
                {$set: {"products.$.quantity": quantity}}
            )
            return updatedCart
        } catch (error) {
            console.error(error)
            return null
        }
    }
    async deleteOneCart(id){
        return this.dao.deleteOne(id)
    }
    async updateCartOwner(cartId, ownerId) {
        // Encuentra el carrito por su ID
        const cart = await this.dao.readOne(cartId);

        // Verifica si el carrito existe
        if (!cart) {
            throw new Error('Cart not found');
        }

        // Actualiza el propietario del carrito
        cart.owner = ownerId;

        // Guarda los cambios en la base de datos
        await cart.save();

        return cart;
    }
}

