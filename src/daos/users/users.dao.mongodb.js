
import { userSchema } from '../../schemas/user.schema.js'
import { UserDaoMongoose } from './dao.mongoose.js'


const mongooseSchemaConfig = {
  versionKey: false,
  strict: 'throw',
  methods: {
    toPojo: () => {
      return JSON.parse(JSON.stringify(this))
    }
  }
}

export const collName = 'users'

export const usersDao = new UserDaoMongoose(collName, userSchema, mongooseSchemaConfig)