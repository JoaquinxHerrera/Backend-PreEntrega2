import mongoose from "mongoose";
import {randomUUID} from "node:crypto"

const collection = 'users'

const schema = new mongoose.Schema({
    _id: {type: String, default: randomUUID},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    surname: {type: String, required: true},
}, {
    strict: 'throw',
    versionKey: false,
})

export const userManager = mongoose.model(collection, schema)
