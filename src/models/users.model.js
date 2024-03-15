import { randomUUID } from 'crypto'
import { DEFAULT_ROLE } from '../config/config.js'


export class User {
  constructor({
    _id,
    first_name,
    last_name,
    password,
    email,
    rol,
  }) {
    this._id = _id || randomUUID()
    this.first_name = first_name
    this.password = password
    this.last_name = last_name
    this.email = email
    this.rol = rol || DEFAULT_ROLE
  }

  toPojo() {
    return {
      _id: this._id,
      first_name: this.first_name,
      password: this.password,
      last_name: this.last_name,
      email: this.email,
      rol: this.rol,
    }
  }
}