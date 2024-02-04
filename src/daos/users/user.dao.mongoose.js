import mongoose, { model } from "mongoose";
import {randomUUID} from "node:crypto"
import { hasheadasSonIguales } from "../../utils/criptografia.js";


const collection = 'users'

const userSchema = new mongoose.Schema({
    _id: {type: String, default: randomUUID},
    email: {type: String, unique: true, required: true},
    password: {type: String, default: '(no aplica)'},
    name: {type: String, default: '(sin especificar)'},
    surname: {type: String, default: '(sin especificar)'},
}, {
    strict: 'throw',
    versionKey: false,
    statics:{
        login: async function (email, password) {
            let userData
        
            if(email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                userData = {
                    email: 'admin',
                    name: 'admin',
                    surname: 'admin',
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
                    name: user['name'],
                    surname: user['surname'],
                    rol: 'usuario'
                }
            }
            return userData
        }
    }
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
        return await User.findById({_id: id}).lean()
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