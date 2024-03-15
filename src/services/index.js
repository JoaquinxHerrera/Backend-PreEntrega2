
import { CartDaoMongoose } from "../daos/carts/cart.dao.mongoose.js";
import { ProductsDaoMongoose } from "../daos/products/products.dao.mongoose.js";
import { TicketDaoMongoose } from "../daos/tickets/ticket.dao.mongoose.js";
import { UsersDaoMongoose } from "../daos/users/users.dao.mongoose.js";
import { CartRepository } from "./cart.service.js";
import { ProductRepository } from "./products.service.js";
import { TicketRepository } from "./ticket.service.js";
import { UserRepository } from "./user.service.js";


export const userService = new UserRepository(new UsersDaoMongoose())
export const productService = new ProductRepository(new ProductsDaoMongoose())
export const cartService = new CartRepository(new CartDaoMongoose())
export const ticketService = new TicketRepository(new TicketDaoMongoose())