import mongoose from "mongoose";
import { MONGODB_CNX_STR } from "../config/config.js";
import { logger } from "../utils/logger.js";


export function connectDb() {
  mongoose.connect(MONGODB_CNX_STR);
  return logger.info(`DB conectada a ${MONGODB_CNX_STR}`);
}

export { productService } from "../services/index.js";
export { cartService } from "../services/index.js";