import { Router } from "express";
import { Product } from "../models/Product.js";

export const productsRouter = Router()

productsRouter.get('/', async (req, res, next)=>{
    const opcionesDePaginacion = {
        limit: req.query.limit || 10,
        page: req.query.page || 1,
        lean: true
    }

    const criterioDeBusqueda ={}
    
    if (req.query.title) {criterioDeBusqueda.title = req.query.title}
    if (req.query.category) {criterioDeBusqueda.category = req.query.category}
    
    const sortOptions = {};
    if (req.query.sort) {
        sortOptions.price = req.query.sort === 'desc' ? -1 : 1;
    }

    try {
        const result = await Product.paginate(criterioDeBusqueda, {
            ...opcionesDePaginacion,
            sort: sortOptions 
        });
        console.log(result)

        res.render('products.handlebars', {
            status: 'success/error',
            pageTitle: 'Products',
            payload: result,
            totalPages: result.docs.length > 0,
            ...result,
            // prevPage: result.prevPage,
            // nextPage: result.nextPage,
            // page: result.page,
            // hasPrevPage: result.hasPrevPage,
            // hasNextPage: result.hasNextPage,
            // prevLink: result.prevLink,
            // nextLink: result.nextLink


        });
    } catch (error) {
        console.error('Error fetching and rendering products:', error);
        res.render('error.handlebars', { error: 'Internal Server Error' });
    }
});




productsRouter.get('/:id', async(req, res) =>{
    const product = await Product.findById(req.params.id).lean()
    res.json(product)
})

// productsRouter.post('/', async(req, res) =>{
//     try{
//         const product = await Product.create(req.body)
//         res.status(201).json(product.toObject())
//     } catch(error){
//         res.status(400).json({message: error.message})

//     }
// })

// productsRouter.delete('/:id', async (req, res) => {
//     const borrado = await Product.findByIdAndDelete(req.params.id)

//     if (!borrado) {
//         return res.status(404).json({message: 'usuario no encontrado'})
//     }
//     res.json(borrado)
// })

// productsRouter.put('/:id', async (req, res)=>{
//     let actualizado
//     try{
//         actualizado = await Product.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})//set es una operacion de mongo para actualizar, el new:true es para que devuelva el elemento actualizado,porque encuentra el elemento y despues lo actualiza, si no estuviera devolveria el elemento no actualizado.
//     } catch(error){
//         return res.status(400).json({message: error.message})
//     }

//     if (!actualizado){
//         return res.status(404).json({ message: 'product not found'})
//     }

//     res.json(actualizado)
// })
