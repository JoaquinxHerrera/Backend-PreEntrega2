import mongoose from "mongoose";
import { MONGODB_CNX_STR } from "../config/config.js";

export function connectDb() {
  mongoose.connect(MONGODB_CNX_STR);
  return console.log(`DB conectada a ${MONGODB_CNX_STR}`);
}

export { productsDaoMongoose } from "./product.dao.mongoose.js";
export { cartsDaoMongoose } from "./cart.dao.mongoose.js";