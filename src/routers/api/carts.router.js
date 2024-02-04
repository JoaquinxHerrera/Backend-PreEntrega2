import { Router } from "express";
import { deleteCartController, deleteProductOnCartController, getCartByIdController, getCartsController, postCartController, postIdController, updateCartController, updateProductOnCartController } from "../../controllers/carts.controller.js";


export const cartsRouter = Router()

cartsRouter.post('/', postCartController)
cartsRouter.get('/', getCartsController)
cartsRouter.get('/:cid', getCartByIdController)
cartsRouter.post('/:cid/products/:pid', postIdController)
cartsRouter.put('/:cid', updateCartController)
cartsRouter.put('/:cid/products/:pid', updateProductOnCartController)
cartsRouter.delete('/:cid', deleteCartController)
cartsRouter.delete('/:cid/products/:pid', deleteProductOnCartController)
