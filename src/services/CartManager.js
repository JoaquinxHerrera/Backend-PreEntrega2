import { Router } from "express";
import { cartsManager } from "../daos/models/mongodb.js";
import { productsManager } from "../daos/models/mongodb.js";
import mongoose from "mongoose";

export const cartsRouter = Router()

cartsRouter.post('/', async(req, res) =>{
    try{
        const cart = await cartsManager.create(req.body)
        res.status(201).json(cart)
    } catch(error){
        res.status(400).json({message: error.message})
    }
})

cartsRouter.get('/:cid', async(req, res) =>{
    try{
        const cart = await cartsManager.findById(req.params.cid).lean()

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
})

cartsRouter.post('/:cid/product/:id', async(req,res)=>{
    try{
        const cart = await cartsManager.findById(req.params.cid)
    
    
        if (!cart){
            return res.status(404).json({message: 'Cart not found'})
        }

        const productId = req.params.id;

        const existingProduct = await productsManager.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

       const existingCartItem = cart.products.find(product => product.product === productId);

        if (existingCartItem) {
            // Si el producto ya existe, incrementar la cantidad
            existingCartItem.quantity += 1;
        } else {
            // Si el producto no existe en el carrito, agregarlo con cantidad 1
            cart.products.push({ product: productId, quantity: 1 });
        }

        // Guardar la actualización del carrito
        const updatedCart = await cart.save();
        

        res.status(200).json({ console: 'Product added to the cart successfully', updatedCart});
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
})



// cartsRouter.delete('/:id', async (req, res) => {
//     const borrado = await cartsManager.findByIdAndDelete(req.params.id)

//     if (!borrado) {
//         return res.status(404).json({message: 'usuario no encontrado'})
//     }
//     res.json(borrado)
// })

// cartsRouter.put('/:id', async (req, res)=>{
//     let actualizado
//     try{
//         actualizado = await cartsManager.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})//set es una operacion de mongo para actualizar, el new:true es para que devuelva el elemento actualizado,porque encuentra el elemento y despues lo actualiza, si no estuviera devolveria el elemento no actualizado.
//     } catch(error){
//         return res.status(400).json({message: error.message})
//     }

//     if (!actualizado){
//         return res.status(404).json({ message: 'product not found'})
//     }

//     res.json(actualizado)
// })
