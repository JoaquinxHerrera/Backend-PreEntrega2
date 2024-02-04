import { productsDaoMongoose } from "../daos/products/products.dao.mongoose.js"

class ProductService{
    async getProducts(){
        return await productsDaoMongoose.readMany({})
    }

    async getProductById(id){
        const productById = await productsDaoMongoose.readOne({_id: id})
        return productById
    }

    async addProduct(productData){
        const product = await productsDaoMongoose.create(productData)
        return product
    }

    async updateProduct(id, data){
        return productsDaoMongoose.updateOne(id, data)
    }

    async deleteProduct(id){
        return productsDaoMongoose.deleteOne(id)
    }
}

export const productService = new ProductService()