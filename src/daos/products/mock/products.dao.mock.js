import {faker} from '@faker-js/faker'

function createProductMock(){
  return{
    _id: faker.string.uuid(),
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    category: faker.commerce.department(),
    description: faker.commerce.productDescription(),
    image: faker.image.url(),
    code: faker.string.numeric(),
    status: faker.datatype.boolean(),
    stock: faker.string.numeric(),
  }
}



export class ProductsDaoMock {

  constructor(){
    this.products = []
  }

  async create(data) {
    throw new Error('NOT IMPLEMENTED')
  }

  async readOne() {
    throw new Error('NOT IMPLEMENTED')
  }

  async readMany(){
    const products = []
    for (let i = 0; i < 100; i++) {
      products.push(createProductMock())
      
    }
    return products
  }

  async updateOne(query, data){
    throw new Error('NOT IMPLEMENTED')
  }

  async updateMany(query, data) {
    throw new Error('NOT IMPLEMENTED')
  }

  async deleteOne(query) {
    throw new Error('NOT IMPLEMENTED')
  }

  async deleteMany(query) {
    throw new Error('NOT IMPLEMENTED')
  }

}

const dao = new ProductsDaoMock()
console.log(await dao.readMany())