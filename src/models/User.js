import mongoose, { model } from "mongoose";
import {randomUUID} from "node:crypto"
import { hasheadasSonIguales } from "../utils/criptografia.js";

const collection = 'users'

const schema = new mongoose.Schema({
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

export const userManager = mongoose.model(collection, schema)
