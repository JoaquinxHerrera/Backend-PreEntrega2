export const userSchema = {
    _id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    foto: { type: String },
    rol: { 
        type: String, 
        enum: ['admin', 'user', 'premium'],
        default: 'user'
     },
    
}