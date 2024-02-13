import mongoose, { model, Schema } from "mongoose";
import {randomUUID} from "node:crypto"
import { ADMIN_EMAIL } from "../../config.js";
import { cartService } from "../../services/cart.service.js";
import { hasheadasSonIguales } from "../../utils/criptografia.js";
import { errorStatusMap } from "../../utils/errorCodes.js";
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
    rol: { type: String, enum: ['user', 'admin'], default: "user" }
}, {
    strict: 'throw',
    versionKey: false,
    methods: {
        publicInfo: function (){
            return {
                first_name: this.first_name,
                last_name: this.last_name,
                email: this.email,
                rol: this.rol,
            }
        }
    },
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
                    age: user['age'],
                    cart: user['cart'],
                    rol: 'user',
                }
            }
            return userData
        },
        // register: async function (userData) {
        //     try {
        //       if (!userData.email || !userData.password)
        //         throw new Error("INCORRECT_DATA: Missing required fields");
    
        //       userData.password = hashPassword(userData.password);
        //       if (userData.email === ADMIN_EMAIL) userData.rol = "admin";
        //       const user = await this.create(userData);
        //       return user.toObject();
        //     } catch (error) {
        //       const typedError = new Error(error.message);
        //       typedError.code =
        //         error.code === 11000
        //           ? errorStatusMap.DUPLICATED_KEY
        //           : errorStatusMap.UNEXPECTED_ERROR;
        //       throw typedError;
        //     }
        // },
        authentication: async function ({ username, password }) {
            try {
              const user = await this.findOne({ username });
              if (!user || !areHashesEqual(password, user.password))
                throw new Error("UNAUTHORIZED");
              return user.toObject();
            } catch (error) {
              const typedError = new Error(error.message);
              typedError.code = errorStatusMap.UNAUTHORIZED;
            }
        },
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