import { randomUUID } from 'node:crypto'

export class Cart {
  #_id
  #products
  constructor({ _id = randomUUID() }) {
    this.#_id = _id
    this.#products = []
  }

  get _id() { return this.#_id }
  get products() { return this.#products }

  toPOJO() {
    return {
      _id: this.#_id,
      products: this.#products
    }
  }
}