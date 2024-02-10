import { Router } from "express";
import { deleteCartController, deleteProductOnCartController, getCartByIdController, getCartsController, postCartController, postIdController, updateCartController, updateProductOnCartController } from "../../controllers/carts.controller.js";
import { isAdmin, isUser } from "../../middlewares/authorization.js";


export const cartsRouter = Router()

cartsRouter.post('/', isUser, postCartController)
cartsRouter.get('/', isAdmin, getCartsController)
cartsRouter.get('/:cid', isUser, getCartByIdController)
cartsRouter.post('/:cid/products/:pid', isUser, postIdController)
cartsRouter.put('/:cid', isUser, updateCartController)
cartsRouter.put('/:cid/products/:pid', isUser, updateProductOnCartController)
cartsRouter.delete('/:cid', isUser, deleteCartController)
cartsRouter.delete('/:cid/products/:pid', isUser, deleteProductOnCartController)
