import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import { userService } from "../../services/index.js";
import { hasheadasSonIguales } from "../../utils/criptografia.js";
import { cartService } from "../mongodb.js";
const collection = "users";
const userSchema = new mongoose.Schema(
  {
    _id: {type: String, default: randomUUID},
    email: {type: String, unique: true, required: true, immutable: true},
    password: {type: String, default: '(no aplica)'},
    first_name: {type: String, default: '(sin especificar)'},
    last_name: {type: String, default: '(sin especificar)'},
    age: { type: Number, default: 0 },
    cart: { type: Object, ref: 'carts', required: false },
    rol: { type: String, enum: ['user', 'admin', 'premium'], default: "user" },
    last_connection: {type: Date}
  },
  {
    strict: "throw",
    versionKey: false,
    statics: {
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
                let user = await mongoose.model(collection).findOne({email}).lean()
                let connectionUpdated = await userService.updateOne(user._id, { $set: {last_connection: Date(Date.now).toLocaleString()}})
                user = connectionUpdated
                if (!user){
                    throw new Error('Login failed')
                }
                if (!hasheadasSonIguales(password, user['password'])) {
                    throw new Error ('Login failed')
                }
        
                userData = {
                    _id: user["_id"],
                    email: user['email'],
                    first_name: user['first_name'],
                    last_name: user['last_name'],
                    password: user['password'],
                    age: user['age'],
                    cart: user['cart'],
                    rol: user['rol'],
                    last_connection: user['last_connection']
                }
            }
            return userData
        },
    },
  }
);



export const usersManager = mongoose.model(collection, userSchema);

export class UsersDaoMongoose {
  async create(data) {
    const newUserCart = await cartService.createCart();
    data.cart = newUserCart;
    const user = await usersManager.create(data);
    await cartService.updateCartOwner(newUserCart._id, user._id);
    return user.toObject();
  }
  async readOne(query) {
    return await usersManager.findOne(query).lean();
  }
  async readMany(query) {
    return await usersManager.find(query).lean();
  }
  async updateOne(id, query) {
    return await usersManager.findOneAndUpdate({ _id: id }, query, { new: true }).lean();
  }
  async deleteOne(id) {
    return await usersManager.findOneAndDelete({ _id: id }).lean();
  }
  async deleteMany(query){
    return await usersManager.deleteMany(query).lean()
  }
}