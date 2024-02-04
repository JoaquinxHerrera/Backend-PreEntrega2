import { Schema, model, connect } from 'mongoose';
import {randomUUID} from 'node:crypto'
import mongoosePaginate from 'mongoose-paginate-v2'
import { MONGODB_CNX_STR } from '../../config.js';

const productSchema = new Schema({
    _id: {type: String, default: randomUUID},
    title: {type: String, required: true},
    price: {type: Number, min: 0, default: 0, required: true},
    category: {type: String},
    description: {type: String},
    image: {type: String},
    code: {type: Number, required: true, unique: true},
    status: {type: Boolean},
    stock: {type: Number, min: 0, default: 0, required: true},
},{
    strict: 'throw',
    versionKey: false,
})

productSchema.plugin(mongoosePaginate)

export const Product = model('products', productSchema)

class ProductsDaoMongoose{
    async create(data) {
      const product = await Product.create(data)
      return product.toObject()
    }

    async readOne(id) {
      return await Product.findOne({_id: id}).lean()
    }

    async readMany(query) {
      return await Product.find(query).lean()
    }

    async updateOne(id, data) {
      return await Product.findOneAndUpdate({_id: id}, {$set: data}, {new:true}).lean()
    }

    async deleteOne(id) {
      return await Product.findOneAndDelete({_id: id}).lean()
    }

   
}

export const productsDaoMongoose = new ProductsDaoMongoose()




