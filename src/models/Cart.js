import { Schema, model } from 'mongoose';
import {randomUUID} from 'node:crypto'

const cartSchema = new Schema({
    _id: {type: String, default: randomUUID},
    products: {
        type: [
          {
            _id: false,
            product: { type: String, ref: 'products' },
            quantity: { type: Number, min:0, default: 1 }
          }
        ],
        default: []
      }
},{
    strict: 'throw',
    versionKey: false,
})

export const Cart = model('carts', cartSchema)
