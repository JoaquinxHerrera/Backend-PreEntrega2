import { hashSync, compareSync, genSaltSync } from "bcrypt";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../config.js";

export function hashear(frase) {
    return hashSync(frase, genSaltSync(10))
}

export function hasheadasSonIguales(recibida, almacenada){
    return compareSync(recibida, almacenada)
}

export async function encrypt(data){
    return new Promise((resolve, reject)=>{
        if(!data){
            reject(new Error('No data to encrypt'))
        }
        jwt.sign(data, JWT_SECRET, {expiresIn: '24h'}, (error, encoded) => {
            if(error){
                reject(error)
            } else {
                resolve(encoded)
            }
        })
    })
}

export async function decrypt(token){
    return new Promise((resolve, reject)=>{
        if(!token){
            reject(new Error('No token to decrypt'))
        }
        jwt.verify(token, JWT_SECRET, (error, decoded)=>{
            if(error){
                reject(error)
            }else{
                resolve(decoded)
            }
        })
    })
}