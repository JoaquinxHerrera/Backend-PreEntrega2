import { Router } from "express";
import { productsManager } from "../daos/models/mongodb.js";

export const productsRouter = Router()

productsRouter.get('/', async(req, res) =>{
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : undefined;

        const products = await productsManager.find().limit(limit).lean();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

productsRouter.get('/:id', async(req, res) =>{
    const product = await productsManager.findById(req.params.id).lean()
    res.json(product)
})

productsRouter.post('/', async(req, res) =>{
    try{
        const product = await productsManager.create(req.body)
        res.status(201).json(product.toObject())
    } catch(error){
        res.status(400).json({message: error.message})

    }
})

productsRouter.delete('/:id', async (req, res) => {
    const borrado = await productsManager.findByIdAndDelete(req.params.id)

    if (!borrado) {
        return res.status(404).json({message: 'usuario no encontrado'})
    }
    res.json(borrado)
})

productsRouter.put('/:id', async (req, res)=>{
    let actualizado
    try{
        actualizado = await productsManager.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})//set es una operacion de mongo para actualizar, el new:true es para que devuelva el elemento actualizado,porque encuentra el elemento y despues lo actualiza, si no estuviera devolveria el elemento no actualizado.
    } catch(error){
        return res.status(400).json({message: error.message})
    }

    if (!actualizado){
        return res.status(404).json({ message: 'product not found'})
    }

    res.json(actualizado)
})
