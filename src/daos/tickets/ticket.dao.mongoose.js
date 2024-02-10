import { randomUUID } from "node:crypto";
import { model, Schema } from "mongoose";
import {v4 as uuidv4} from 'uuid'
import { User } from "../users/user.dao.mongoose.js";
import { Cart } from "../carts/cart.dao.mongoose.js";

const ticketSchema = new Schema({
    _id: {type: String, default: randomUUID},
    code: {type: String, default: uuidv4},
    purchase_datetime: {type: Date, default:Date.now},
    amount: {type: Number},
    products:[
        {
            product: {type: Schema.Types.ObjectId, ref: 'Product'},
            quantity: {type: Number, default: 1}
        }
    ],
    purchaser: {type: String}
}, {
    strict: 'throw',
    versionKey: false
});

export const Ticket = model('ticket', ticketSchema)

class TicketDaoMongoose{
    async create(data){
        const ticket = await Ticket.create(data);
        return ticket.toObject();
    }

    async readOne(id) {
        return await Ticket.findOne({ _id: id }).lean();
    }

    async readMany(query) {
        return await Ticket.find(query).lean();
    }

    async updateOne(id, data) {
        return await Ticket.findByIdAndUpdate({ _id: id }, { $set: data }, { new: true }).lean();
    }

    async deleteOne(id) {
        return await Ticket.findByIdAndDelete({ _id: id }).lean();
    }

}

export const ticketDaoMongoose = new TicketDaoMongoose()