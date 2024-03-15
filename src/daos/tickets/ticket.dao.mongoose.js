import { randomUUID } from "node:crypto";
import { model, Schema } from "mongoose";
import {v4 as uuidv4} from 'uuid'


const ticketSchema = new Schema({
    _id: {type: String, default: randomUUID},
    code: {type: String, default: uuidv4},
    purchase_datetime: {type: Date, default:Date.now},
    amount: {type: Number, default: 0},
    purchaser: {type: String}
}, {
    versionKey: false
});

export const ticketManager = model('tickets', ticketSchema)

export class TicketDaoMongoose{
    async create(data){
        const ticket = await ticketManager.create(data);
        return ticket;
    }

    async readOne(id) {
        const ticketForId = await ticketManager.findOne({ _id: id });
        return toPOJO(ticketForId);
    }

    async readMany(query) {
        return await ticketManager.find(query);
    }

    async updateOne(id, data) {
        return await ticketManager.findByIdAndUpdate({ _id: id }, { $set: data }, { new: true });
    }

    async deleteOne(id) {
        return await ticketManager.findByIdAndDelete({ _id: id });
    }

}