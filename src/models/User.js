import { randomUUID } from 'crypto'
import { DEFAULT_ROLE } from '../config.js'


export class User {
  constructor({
    _id,
    first_name,
    last_name,
    password,
    email,
    foto,
    rol,
  }) {
    this._id = _id || randomUUID()
    this.first_name = first_name
    this.last_name = last_name
    this.password = password
    this.email = email
    this.foto = foto
    this.rol = rol || DEFAULT_ROLE
  }

  toPojo() {
    return {
      _id: this._id,
      first_name: this.first_name,
      last_name: this.last_name,
      password: this.password,
      email: this.email,
      foto: this.foto,
      rol: this.rol,
    }
  }
}