import { Router } from "express";
import passport from "passport";
import { createOrderController, deleteCartController, deleteProductOnCartController, getCartByIdController, getCartsController, postCartController, postIdController, updateCartController, updateProductOnCartController } from "../../controllers/carts.controller.js";
import { isAdmin, onlyLoggedRest } from "../../middlewares/authorization.js";


export const cartsRouter = Router()

cartsRouter.post('/', onlyLoggedRest, postCartController)
cartsRouter.get('/', onlyLoggedRest, isAdmin, getCartsController)
cartsRouter.get('/:cid', onlyLoggedRest, getCartByIdController) //ok
cartsRouter.get('/:cid/purchase', onlyLoggedRest, createOrderController) //ok
cartsRouter.post('/:cid/products/:pid', onlyLoggedRest, postIdController)//ok
cartsRouter.put('/:cid', onlyLoggedRest, updateCartController)//ok
cartsRouter.put('/:cid/products/:pid', onlyLoggedRest, updateProductOnCartController)//ok
cartsRouter.delete('/:cid', onlyLoggedRest, deleteCartController)//ok
cartsRouter.delete('/:cid/products/:pid', onlyLoggedRest, deleteProductOnCartController)//ok
// cartsRouter.delete('/', deleteManyController)
// 5520d3f4-dcdc-45d7-940f-62cd525ee40d 27
// 557049e2-d9a1-4729-bac1-c9196f4f14e2