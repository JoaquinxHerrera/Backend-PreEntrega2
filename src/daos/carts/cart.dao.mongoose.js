import { Schema, model } from 'mongoose';
import {randomUUID} from 'node:crypto'
import { productService } from '../../services/index.js';
import { logger } from '../../utils/logger.js';



const cartSchema = new Schema({
    _id: {type: String, default: randomUUID},
    owner: { type: String, required: false }, 
    products: [
        {
            _id: { type: String, ref: 'products' },
            quantity: { type: Number, min:0, default: 1 },
            thumbnail: {type: String, ref: 'products'},
            title:{type: String, ref: 'products'},
            price: { type: Number, ref: 'products' }
        }      
    ],   
},
{
    strict: "throw",
    versionKey: false,
    statics: {
        addProductToCart: async function(cid, pid){
            const initialQuantity = 1
            const cart = await model('carts', cartSchema).findById(cid)
            const product = await productService.getProductById(pid)

            const productIndexFind = cart.products.findIndex(
                (p) => p._id === product._id
            )

            if(productIndexFind === -1){
                await model('carts', cartSchema).findOneAndUpdate(
                    {_id: cid},
                    {
                        $addToSet: {
                            products: {_id: product._id, quantity: initialQuantity, title: product.title, price: product.price,  thumbnail: product.thumbnail}
                        }
                    }
                )
            } else {
                await model('carts', cartSchema).findOneAndUpdate(
                    {_id: cid, 'products._id': product._id},
                    {
                        $inc: {
                            'products.$.quantity': initialQuantity,
                        }
                    }
                )
            }
        },
        deleteProductFromCart: async function (cid, pid){
            try{
                const cart = await model('carts', cartSchema).findById(cid)
                const product = await productService.getProductById(pid)

                const productIndexFind = cart.products.findIndex(
                    (p) => p._id === product._id
                )
    
                if(productIndexFind !== -1){
                    cart.products.splice(productIndexFind, 1)
                    await cart.save()
                    return cart
                }else{
                    throw new Error('Product not found in cart')
                }
            }catch(error){
                logger.info(error)
                throw error;
            }
        },
        updateProductQuantityFromCart: async function (cid, pid, quantity) {
            try {
                const cart = await model('carts', cartSchema).findById(cid);
        
                if (!cart) {
                    throw new Error('Cart not found');
                }
        
                const productIndex = cart.products.findIndex((p) => p.product.toString() === pid);
                if (productIndex !== -1) {
                    cart.products[productIndex].quantity = quantity;
                    await cart.save();
                    return cart;
                } else {
                    throw new Error('Product not found in cart');
                }
            } catch (error) {
                logger.info(error);
                throw error;
            }
        },
        updateCartOwner: async function(cartId, ownerId) {
            return await model('carts').findByIdAndUpdate(cartId, { owner: ownerId }, { new: true });
        }
    },
})

cartSchema.pre('find', function(next){
    this.populate('products._id')
    next()
})


export const cartManager = model('carts', cartSchema)

export class CartDaoMongoose{
    async create(data){
        const cart = await cartManager.create(data)
        return cart
    }
    async readOne(id){
        const cart = await cartManager.findOne({_id: id})
        return cart;
    }
    async readMany(query){
        return await cartManager.find(query)
    }
    async updateOne(id, data){
        return await cartManager.findByIdAndUpdate({_id: id}, {$set: data}, {new:true})
    }
    async deleteOne(id){
        return await cartManager.findByIdAndDelete({_id: id}).toObject()
    }
    async deleteMany(query){
        return await cartManager.deleteMany(query)
    }
}




