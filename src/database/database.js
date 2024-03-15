import {connect as connectToMongoose} from 'mongoose'
import { MODO_EJECUCION, MONGODB_CNX_STR } from '../config/config.js'
import { logger } from '../utils/logger.js'


export async function connect(){
    if(MODO_EJECUCION === 'online') {
        await connectToMongoose(MONGODB_CNX_STR)
        logger.info('connected to mongodb')
    }else{
        logger.info('trabajando con persistencia local')
    }
}