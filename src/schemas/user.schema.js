export const userSchema = {
    _id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    password: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    age: {type: Number, default:0},
    cart: {type: Object, required: true},
    rol: { type: String, required: true, enum: ["admin", "user", "premium"], default: 'user' },
}