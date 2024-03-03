import mongoose from 'mongoose'
import { MONGODB_CNX_STR } from '../src/config.js'
import { User } from '../src/models/User.js'

await mongoose.connect(MONGODB_CNX_STR)

const deleted = await User.deleteMany(
  { first_name: 'admin' }
)

console.log(deleted)

const user = await User.registrar({
  first_name: 'admin',
  last_name: 'admin',
  password: 'admin',
  email: 'admin@admin.com'
})

console.log(user)
 
const updatedUser = await User.findOneAndUpdate(
  { first_name: 'admin' },
  { $set: { rol: 'admin' } },
  { new: true }
)

console.log(updatedUser)

await mongoose.disconnect()