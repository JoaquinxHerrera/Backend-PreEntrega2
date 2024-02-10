import { randomUUID } from 'node:crypto'
import fs from 'fs/promises'
import { matches } from '../utils.js'



class ProductsDaoFiles {

  constructor(path) {
    this.path = path
  }

  async #readProducts() {
    return JSON.parse(await fs.readFile(this.path, 'utf-8'))
  }

  async #writeProducts(products) {
    await fs.writeFile(this.path, JSON.stringify(products, null, 2))
  }

  async create(data) {
    const product = new Product(data)
    const products = await this.#readProducts()
    products.push(product.toObject())
    await this.#writeProducts(products)
    return product.toObject()
  }

  async readOne(query) {
    const products = await this.#readProducts()
    const searched = products.find(matches(query))
    return searched
  }

  async readMany(query){
    const products = await this.#readProducts()
    const searched = products.filter(matches(query))
    return searched
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

const productsDaoFiles = new ProductsDaoFiles('./db/products.json')
console.log('usando persistencia en sistema de archivos')

export async function getDaoFiles(){
    return productsDaoFiles
}