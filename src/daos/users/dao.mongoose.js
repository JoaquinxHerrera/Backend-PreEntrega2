import mongoose from "mongoose"

export class UserDaoMongoose {
    constructor(collName, schema, config){
        this.model = mongoose.model(collName, new mongoose.Schema(schema, config))
    }

    async createOne(userDto){
        await this.model.create(userDto)
    }
    async readOne(query){
        const userDoc = await this.model.findOne(query)
        return userDoc.toPojo()
    }
    async readMany(query){
        const userDocs = await this.model.find(query)
        return userDocs.map(d=>d.toPojo())
    }
    async updateOne(){
        await this.model.findOneAndUpdate()
    }
    async updateMany(){
        await this.model.updateMany()
    }
    async deleteOne(id){
        await this.model.findOneAndDelete
    }
    async deleteMany(){
        await this.model.deleteMany()
    }
}