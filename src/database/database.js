import {connect as connectToMongoose} from 'mongoose'
import { MODO_EJECUCION, MONGODB_CNX_STR } from "../config.js";

export async function connect(){
    if(MODO_EJECUCION === 'online') {
        await connectToMongoose(MONGODB_CNX_STR)
        console.log('connected to mongodb')
    }else{
        console.log('trabajando con persistencia local')
    }
}