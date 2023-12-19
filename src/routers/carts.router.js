import { Router } from "express";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";

export const cartsRouter = Router()

cartsRouter.post('/', async(req, res) =>{
    try{
        const cart = await Cart.create(req.body)
        res.status(201).json(cart)
    } catch(error){
        res.status(400).json({message: error.message})
    }
})

cartsRouter.get('/:cid', async(req, res) =>{
    try{
        const cart = await Cart.findById(req.params.cid).populate('products.product').lean()
        res.json(cart)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

cartsRouter.post('/:cid/products/:id', async(req,res)=>{
    try{
        const cart = await Cart.findById(req.params.cid)
    
        if (!cart){
            return res.status(404).json({message: 'Cart not found'})
        }

        const productId = req.params.id;

        const existingProduct = await Product.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

       const existingCartItem = cart.products.find(product => product.product === productId);

        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        const updatedCart = await cart.save();
        

        res.status(200).json({ console: 'Product added to the cart successfully', updatedCart});
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
})

cartsRouter.delete('/:cid/products/:id', async (req,res) => {
    try{
        const cartBuscado = await Cart.findById(req.params.cid)

        if (!cartBuscado){
            return res.status(400).json({message: 'Cart Not Found'})
        }
    
        const productBuscadoId = req.params.id;
    
        const existingProduct = await Product.findById(productBuscadoId) 
    
        if(!existingProduct){
            return res.status(400).json({message: 'Product Not Found'})
        }
    
        const existingCartItem = cartBuscado.products.find(product => product.product === productBuscadoId)
    
        if(existingCartItem){
            existingCartItem.quantity -= 1
        } else{
            res.status(400).json({message: 'Product Not Found In Cart'})
        }
    
        const updatedCart = await cartBuscado.save();
            
    
        res.status(200).json({ console: 'Product removed from the cart successfully', updatedCart});

    }catch (error) {
        res.status(500).json({ message: error.message });
    }
})   

cartsRouter.put('/:cid', async(req,res)=>{
    try {
        if (req.body.products && req.body.products.length > 0) {
            const updatedProducts = await Promise.all(req.body.products.map(async (product) => {
                const existingProduct = await Product.findById(product.product);
                if (!existingProduct) {
                    return { error: `Product with ID ${product.product} not found` };
                }
        
                if (!Number.isInteger(product.quantity) || product.quantity < 0) {
                    return { error: `Invalid quantity for product with ID ${product.product}` };
                }
        
                return {
                    product: existingProduct._id,
                    quantity: product.quantity,
                };
            }));
        
            req.body.products = updatedProducts.filter((product) => !product.error && product.quantity > 0);
        
            const errors = updatedProducts.filter((product) => product.error);
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }
        }
        
        const updatedCart = await Cart.findByIdAndUpdate(req.params.cid, { $set: req.body }, { new: true });
        
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

cartsRouter.put('/:cid/products/:id', async(req,res)=>{
    try{
        const cartBuscado = await Cart.findById(req.params.cid)

        if (!cartBuscado){
            return res.status(400).json({message: 'Cart Not Found'})
        }
    
        const productBuscadoId = req.params.id;
        
        const existingProduct = cartBuscado.products.find(product => product.product === productBuscadoId);
    
        if (existingProduct) {
            if (req.body.quantity !== undefined && Number.isInteger(req.body.quantity) && req.body.quantity >= 0) {
                existingProduct.quantity = req.body.quantity;
            } else {
                return res.status(400).json({ message: 'Invalid quantity for the product' });
            }
        } else {
            return res.status(400).json({ message: 'Product Not Found In Cart' });
        }
        
        const updatedCart = await cartBuscado.save();
            
    
        res.status(200).json({ console: 'Product updated successfully', updatedCart});

    }catch (error) {
        res.status(500).json({ message: error.message });
    }
})

cartsRouter.delete('/:cid', async(req,res)=>{
    try{
        const cartBuscado = await Cart.findById(req.params.cid)

        if (!cartBuscado){
            return res.status(400).json({message: 'Cart Not Found'})
        } 

        cartBuscado.products = [];
        await cartBuscado.save();

        res.status(200).json({ message: 'All products removed from the cart successfully', updatedCart: cartBuscado });

    } catch (error){
        res.status(400).json({message: error.message})
    }
})