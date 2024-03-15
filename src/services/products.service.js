
export class ProductRepository{
    constructor(dao){
        this.dao = dao;
    }
    async getProducts(){
        return await this.dao.readMany({})
    }

    async getProductById(pid){
        const productById = await this.dao.readOne({_id: pid})
        return productById
    }

    async addProduct(productData, ownerId){
        const product = await this.dao.create(productData, ownerId)
        return product
    }

    async updateProduct(id, productData){
        return this.dao.updateOne(id, productData)
    }

    async deleteProduct(id){
        return this.dao.deleteOne(id)
    }
}

