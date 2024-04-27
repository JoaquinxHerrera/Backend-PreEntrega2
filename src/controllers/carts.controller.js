
import { isErrored } from "stream";
import {cartManager } from "../daos/carts/cart.dao.mongoose.js"
import { productManager } from "../daos/products/products.dao.mongoose.js";
import { cartService, productService, ticketService, userService } from "../services/index.js";





export async function createOrderController(req, res){
    const { cid } = req.params;
    try {
      // Obtiene el carrito y el usuario correspondiente a ese carrito
      const cart = await cartService.getCartById({ _id: cid });
      const user = await userService.getUsers({ cart: cid });
  
      // Crea una lista de productos, la rellena y lo muestra por consola
      let productList = [];
  
      // Array para almacenar los IDs de los productos que no se pudieron comprar
      let outOfStockProducts = [];
  
      // Añade la cantidad y los productos a productList y comprueba el stock
      await Promise.all(
        cart.products.map(async (product) => {
          const productsFounded = await productService.getProductById(
            product._id
          );
          if (productsFounded.stock >= product.quantity) {
            // Si hay suficiente stock, resta la cantidad comprada al stock del producto
            await productService.updateProduct(product._id, {
              stock: productsFounded.stock - product.quantity,
            });
            productsFounded.quantity = product.quantity;
            productList.push(productsFounded);
          } else {
            // Si no hay suficiente stock, agrega el ID del producto al array de productos sin stock
            outOfStockProducts.push(product._id);
          }
        })
      );
  
      // Filtra el carrito original para quedarse solo con los productos sin stock
      const updatedProducts = cart.products.filter((product) =>
        outOfStockProducts.includes(product._id)
      );
  
      // Actualiza el carrito en la base de datos
      await cartService.updateOneCart(cid, {products: updatedProducts});
      // Calcula el total gastado en la compra
      const total = productList.reduce(
        (accumulator, currentProduct) =>
          accumulator + currentProduct.price * currentProduct.quantity,
        0
      );
      // Instancia el ticket
      const ticket = await ticketService.createTicket({
        amount: total,
        purchaser: user[0].email,
      });
      // Retorna el ticket generado y el array de IDs de productos sin stock
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

            // Agregar el producto al carrito
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