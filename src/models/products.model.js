import {randomUUID} from 'node:crypto'

export class Product {
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

  toPOJO() {
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