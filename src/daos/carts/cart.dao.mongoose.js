import { Schema, model } from 'mongoose';
import {randomUUID} from 'node:crypto'
import {productsDaoMongoose} from '../products/products.dao.mongoose.js';

const cartSchema = new Schema({
    _id: {type: String, default: randomUUID},
    products: {
        type: [
          {
            _id: false,
            product: { type: String, ref: 'products' },
            quantity: { type: Number, min:0, default: 1 }
          }
        ],
        default: []
      }
},{
    strict: false,
    versionKey: false,
    statics: {
        addProductToCart: async function(cid, pid){
            const initialQuantity = 1
            const cart = await model('carts', cartSchema).findById(cid)
            const product = await productsDaoMongoose.readOne({_id: pid})

            const productIndexFind = cart.products.findIndex(
                (p) => p._id === product._id
            )

            if(productIndexFind === -1){
                await model('carts', cartSchema).findOneAndUpdate(
                    {_id: cid},
                    {
                        $addToSet: {
                            products: {_id: product._id, quantity: initialQuantity}
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
                const product = await productsDaoMongoose.readOne({_id: pid})

                const productIndexFind = cart.products.findIndex(
                    (p) => p._id === product._id
                )
    
                if(productIndexFind === -1){
                    cart.products.splice(productIndexFind, 1)
                    await cart.save()
                    return cart
                }else{
                    throw new Error('Product not found in cart')
                }
            }catch(error){
                console.log(error)
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
                console.log(error);
                throw error;
            }
        },
    },
})

cartSchema.pre('find', function(next){
    this.populate('products.product')
    next()
})

export const Cart = model('carts', cartSchema)

class CartDaoMongoose{
    async create(data){
        const cart = await Cart.create(data)
        return cart.toObject()
    }
    async readOne(id){
        return await Cart.findOne({_id: id})
    }
    async readMany(query){
        return await Cart.find(query).lean()
    }
    async updateOne(id, data){
        return await Cart.findByIdAndUpdate({_id: id}, {$set: data}, {new:true}).lean()
    }
    async deleteOne(id){
        return await Cart.findByIdAndDelete({_id: id}).lean()
    }
}

export const cartsDaoMongoose = new CartDaoMongoose()


