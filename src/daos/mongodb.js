import mongoose from "mongoose";
import { MONGODB_CNX_STR } from "../config.js";


export function connectDb() {
  mongoose.connect(MONGODB_CNX_STR);
  return console.log(`DB conectada a ${MONGODB_CNX_STR}`);
}

export { productsDaoMongoose } from "./products/products.dao.mongoose.js";
export { cartsDaoMongoose } from "./carts/cart.dao.mongoose.js";