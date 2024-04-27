import {cartManager } from "../daos/carts/cart.dao.mongoose.js"
import { cartService, productService, ticketService, userService } from "../services/index.js";

export async function createOrderController(req, res){
    const { cid } = req.params;
    try {
      const cart = await cartService.getCartById({ _id: cid });
      const user = await userService.getUsers({ cart: cid });
      let productList = [];
      let outOfStockProducts = [];

      await Promise.all(
        cart.products.map(async (product) => {
          const productsFounded = await productService.getProductById(
            product._id
          );
          if (productsFounded.stock >= product.quantity) {
            await productService.updateProduct(product._id, {
              stock: productsFounded.stock - product.quantity,
            });
            productsFounded.quantity = product.quantity;
            productList.push(productsFounded);
          } else {
            outOfStockProducts.push(product._id);
          }
        })
      );
  
      const updatedProducts = cart.products.filter((product) =>
        outOfStockProducts.includes(product._id)
      );
  
      await cartService.updateOneCart(cid, {products: updatedProducts});
      const total = productList.reduce(
        (accumulator, currentProduct) =>
          accumulator + currentProduct.price * currentProduct.quantity,
        0
      );
      const ticket = await ticketService.createTicket({
        amount: total,
        purchaser: user[0].email,
      });
      res.status(200).send({ ticket, outOfStockProducts });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

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
    const {cid} = req.params
    const user = req.user
    try{
        const cartById = await cartService.getCartById(cid)
        if(cartById.owner !== user._id && user.rol !== "admin"){
            return res.status(403).json({ message: 'You are not authorized to access this cart.' });
        }
        return res.status(200).json({cartById})
    } catch(error){
        res.status(404).json({message: error.message})
    } 
}

export async function postCartController(req, res, next){
    try{
        const ownerId = req.user._id
        const cart = await cartService.createCart(ownerId)
        res.status(201).json(cart)
    }catch(error){
        next(error)
    } 
}

export async function postIdController(req,res, next){
    const {cid, pid} = req.params
    
    try {
        const userEmail = req.user.email;
        console.log(`user email: ${userEmail}`);
        const product = await productService.getProductById(pid);
        console.log(`owner del producto: ${product.owner}`);
        const productOwner = product.owner;
        if (userEmail !== productOwner) {
            const cart = await cartManager.findById(cid);
            if (!cart) {
                return res.status(404).json({ status: "error", message: "Cart not found" });
            }
            await cartManager.addProductToCart(cid, pid);
            return res.status(201).json({ message: `Product with ID ${pid} added to cart` });
        } else {
            return res.status(401).json({ status: "error", message: "Unauthorized: You can't buy your own products" });
        }
        
        
    }catch(error){
        next(error)
    }
}

export async function deleteCartController(req, res){
    const {cid} = req.params
    const user = req.user
    try{
        const cartById = await cartService.getCartById(cid)
        if (cartById.owner !== user._id) {
            return res.status(401).send({ message: 'Unauthorized: Cart does not belong to the user' });
        }
        await cartService.updateOneCart(cid, {products: []})
        res.status(200).json({message: "cart deleted"})
    }catch(error){
        res.status(404).send({message: error.message})
    }
}

export async function deleteProductOnCartController(req, res, next){
    const {cid, pid} = req.params;
    const user = req.user
    try{
        const cartById = await cartService.getCartById(cid)
        if (!cartById) {
            return res.status(404).send({ message: 'Cart not found' });
        }

        if (cartById.owner !== user._id) {
            return res.status(401).send({ message: 'Unauthorized: Cart does not belong to the user' });
        }
        const cart = await cartService.getCartById(cid)
        const product = await productService.getProductById(pid)
        if(!cart){
            res.status(404).send({message: 'The cart does not exist'})
        } else if(!product){
            res.status(404).send({message: 'The product does not exist'})
        }else{
            await cartManager.deleteProductFromCart(cid, pid)
            res.status(200).send(`product deleted id: ${pid}`)
        }
    }catch(error){
        next(error)
    }
}

export async function updateCartController(req, res){
    const {cid} = req.params
    const user = req.user
    try {
        const cartById = await cartService.getCartById(cid)
        if (cartById.owner !== user._id ) {
            return res.status(401).send({ message: 'Unauthorized: Cart does not belong to the user' });
        }
        const updatedProducts = req.body.map(product=>{
            if (product._id !== cartById.products.find(p => p._id === product._id)._id) {
                throw new Error('Product ID cannot be modified.');
            }
            
            if(product.quantity < 0){
                throw new Error('Product quantity cannot be negative.')
            }
            return product
        })
        
        await cartService.updateOneCart(cid, { products: updatedProducts });
        res.status(201).json(cid);
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
}

export async function updateProductOnCartController(req, res){
    const {cid, pid} = req.params;
    const {quantity} = req.body;
    const user = req.user

    try {
        if (user.cart !== cid ) {
            return res.status(401).send({ message: 'Unauthorized: Cart does not belong to the user' });
        }
        const cart = await cartService.getCartById(cid)
        if (!cart) {
            return res.status(404).send({ message: 'Cart not found' });
        }
        const product = await productService.getProductById(pid)
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        
        if(quantity < 0){
            return res.status(404).send({message: 'Product quantity cannot be negative.'})
        }
        const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity)

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