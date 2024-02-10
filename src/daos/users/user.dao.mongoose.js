import mongoose, { model, Schema } from "mongoose";
import {randomUUID} from "node:crypto"
import { cartService } from "../../services/cart.service.js";
import { hasheadasSonIguales } from "../../utils/criptografia.js";
import { Cart } from "../carts/cart.dao.mongoose.js";

const collection = 'users'

const userSchema = new mongoose.Schema({
    _id: {type: String, default: randomUUID},
    email: {type: String, unique: true, required: true},
    password: {type: String, default: '(no aplica)'},
    first_name: {type: String, default: '(sin especificar)'},
    last_name: {type: String, default: '(sin especificar)'},
    age: { type: Number, default: 0 },
    cart: { type: Object, ref: 'carts', required: true },
    rol: { type: String, default: "user" }
}, {
    strict: 'throw',
    versionKey: false,
    statics:{
        login: async function (email, password) {
            let userData
        
            if(email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                userData = {
                    email: 'admin',
                    first_name: 'admin',
                    last_name: 'admin',
                    rol: 'admin'
                }
            }else {
                const user = await mongoose.model(collection).findOne({email}).lean()
        
                if (!user){
                    throw new Error('Login failed')
                }
                if (!hasheadasSonIguales(password, user['password'])) {
                    throw new Error ('Login failed')
                }
        
                userData = {
                    email: user['email'],
                    first_name: user['first_name'],
                    last_name: user['last_name'],
                    age: user['user'],
                    cart: user['cart'],
                    rol: 'usuario',
                }
            }
            return userData
        }
    }
})

userSchema.pre('findOne', function(next){
    this.populate('cart')
    next()
})

export const User = mongoose.model(collection, userSchema)

class UserDaoMongoose {
    async create(data){
        const newUserCart = await cartService.createCart()
        data.cart = newUserCart
        const user = await User.create(data)
        return user.toObject()
    }
    async readOne(id){
        return await User.findById({_id:id})
    }
    async readMany(query){
        return await User.find(query).lean()
    }
    async updateOne(id, data){
        return await User.findByIdAndUpdate({_id:id}, {$set: data}, {new: true}).lean()
    }
    async deleteOne(id){
        return await User.findByIdAndDelete({_id: id}).lean()
    }
}

export const userDaoMongoose = new UserDaoMongoose()