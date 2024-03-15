import { Schema, model } from 'mongoose';
import {randomUUID} from 'node:crypto'
import mongoosePaginate from 'mongoose-paginate-v2'
import {v4 as uuidv4} from 'uuid'


const productSchema = new Schema({
    _id: {type: String, default: randomUUID},
    title: {type: String, required: true},
    price: {type: Number, min: 0, default: 0, required: true},
    category: {type: String},
    description: {type: String},
    thumbnail: {type: String},
    code: {type: String, default: uuidv4},
    status: {type: Boolean},
    stock: {type: Number, min: 0, default: 0, required: true},
    owner: {type: String, default: "admin"},
},{
    strict: 'throw',
    versionKey: false,
})

productSchema.plugin(mongoosePaginate)

export const productManager = model('products', productSchema)

export class ProductsDaoMongoose{
    async create(data, ownerId) {
      const product = await productManager.create(data)
      const productWithOwner = await productManager.findOneAndUpdate(
        {_id: product._id},
        {$set: {owner: ownerId}},
        {new: true}
      )
      return productWithOwner.toObject();
    }

    async readOne(pid) {
      return await productManager.findOne({_id: pid}).lean()
    }

    async readMany(query) {
      return await productManager.find(query).lean()
    }

    async updateOne(id, data) {
      return await productManager.findOneAndUpdate({_id: id}, {$set: data}, {new:true}).lean()
    }

    async deleteOne(id) {
      return await productManager.findOneAndDelete({_id: id}).lean()
    }

   
}





