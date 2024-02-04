
import { Cart } from "../daos/carts/cart.dao.mongoose.js"
import { cartService } from "../services/cart.service.js"
import { productService } from "../services/products.service.js"

export async function getCartsController(req, res){
    let limit = req.query.limit
    const data = await cartService.getCarts({})
    try{
        if(!limit){
            return res.json(data)
        }
        let limitedCarts = data.slice(0, limit)
        return res.json(limitedCarts)
    }catch(error){
        res.status(404).send({message: error.message})
    }
}

export async function getCartByIdController(req, res){
    const cid = req.params.cid
    try{
        const cartById = await cartService.getCartById(cid)
        return res.json({cartById})
    } catch(error){
        res.status(404).json({message: error.message})
    } 
}

export async function postCartController(req, res){
    try{
        const cart = await cartService.createCart(req.body)
        res.created(cart)
    }catch(error){
        res.status(400).json({message: error.message})
    } 
}

export async function postIdController(req,res){
    const {cid, pid} = req.params
    try {
        await Cart.addProductToCart(cid, pid)
        return res.send(cid)
    }catch(error){
        res.status(400).send({message: error.message})
    }
}

export async function deleteCartController(req, res){
    const cid = req.params.cid
    try{
        await cartService.updateOneCart(cid, {products: []})
        res.json(req.body)
    }catch(error){
        res.status(404).send({message: error.message})
    }
}

export async function deleteProductOnCartController(req, res){
    const cid = req.params.cid
    const pid = req.params.pid

    try{
        const cart = await cartService.getCartById(cid)
        const product = await productService.getProductById(pid)
        if(!cart){
            res.status(404).send({message: 'The cart does not exist'})
        } else if(!product){
            res.status(404).send({message: 'The product does not exist'})
        }else{
            await Cart.deleteProductFromCart(cid,pid)
            res.status(200).send(`product deleted id: ${pid}`)
        }
    }catch(error){
        res.status(500)
    }
}

export async function updateCartController(req, res){
    const cid = req.params.cid

    try {
        const existingCart = await cartService.getCartById(cid);
        if (!existingCart) {
            return res.status(404).send({ message: 'Cart not found' });
        }

        const newProducts = req.body.products;
        if (!newProducts || !Array.isArray(newProducts)) {
            return res.status(400).send({ message: 'Invalid products data' });
        }

        
        existingCart.products = newProducts;

        
        const updatedCart = await cartService.updateOneCart(cid, existingCart);

        res.json(updatedCart);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export async function updateProductOnCartController(req, res){
    const cid = req.params.cid
    const pid = req.params.pid
    const quantity = req.body.quantity

    try {
        const existingCart = await cartService.getCartById(cid)
        if (!existingCart) {
            return res.status(404).send({ message: 'Cart not found' });
        }
        const existingProduct = await productService.getProductById(pid)
        if (!existingProduct) {
            return res.status(404).send({ message: 'Product not found' });
        }
        
        const updatedCart = await Cart.updateProductQuantityFromCart(cid, pid, quantity)

        if(updatedCart){
            return res.status(200).send('Quantity updated')
        }else{
            return res.status(400).send('It was not possible to update the quantity')
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send('Internal Error')
    }

}