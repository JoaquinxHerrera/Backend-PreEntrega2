import { randomUUID } from 'node:crypto'
import fs from 'fs/promises'
import { matches } from '../utils.js'

class Product {
    #_id
    #title
    #price
    #category
    #description
    #image
    #code
    #status
    #stock
  constructor({ _id = randomUUID(), title, price, category, description, image, code, status, stock }) {
    this.#_id = _id
    this.title = title
    this.price = price
    this.category = category
    this.description = description
    this.image = image
    this.code = code
    this.status = status
    this.stock = stock
  }

  get _id() { return this.#_id }
  get title() { return this.#title }
  get price() { return this.#price }
  get category() {return this.#category}
  get description() {return this.#description}
  get image() {return this.#image}
  get code() {return this.#code}
  get status() {return this.#status}
  get stock() {return this.#stock}

  set title(value) {
    if (!value) throw new Error('The title is necessary')
    this.#title = value
  }

  set price(value) {
    if (!value) throw new Error('The price is necessary')
    if (value <= 0) throw new Error('The price should be positive')
    this.#price = value
  }

  set code(value) {
    if (!value) throw new Error('The code is necessary')
    this.#code = value
  }

  set stock(value) {
    if (!value) throw new Error('The stock is necessary')
    if (value <= 0) throw new Error('The stock should be positive')
    this.#stock = value
  }

  toObject() {
    return {
      _id: this.#_id,
      title: this.#title,
      price: this.#price,
      category: this.#category,
      description: this.#description,
      image: this.#image,
      code: this.#code,
      status: this.#status,
      stock: this.#stock,
    }
  }
}

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