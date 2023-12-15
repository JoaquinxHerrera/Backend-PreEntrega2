import { Schema, model } from 'mongoose';
import {randomUUID} from 'node:crypto'
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new Schema({
    _id: {type: String, default: randomUUID},
    title: {type: String, required: true},
    description: {type: String},
    code: {type: Number, required: true, unique: true},
    price: {type: Number, min: 0, default: 0, required: true},
    status: {type: Boolean},
    stock: {type: Number, min: 0, default: 0, required: true},
    category: {type: String},
    thumbnail: {type: String}
},{
    strict: 'throw',
    versionKey: false,
})

productSchema.plugin(mongoosePaginate)

export const Product = model('products', productSchema)
