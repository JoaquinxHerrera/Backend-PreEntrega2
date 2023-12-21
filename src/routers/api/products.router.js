import { Router } from "express";
import { Product } from "../../models/Product.js";
import axios from 'axios';

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
    if (req.query.status !== undefined){query.status = req.query.status === "true"}
    
    const sortOptions = {};
    if (req.query.sort) {
        sortOptions.price = req.query.sort === 'desc' ? -1 : 1;
    }

    try {
        const data = await Product.paginate(criterioDeBusqueda, {
            ...opcionesDePaginacion,
            sort: sortOptions 
        });
        

        const response = {
            status: res.status,
            payload: data.docs,
            prevPage: data.prevPage,
            nextPage: data.nextPage,
            page: data.page,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            prevLink: data.prevLink,
            nextLinl: data.nextLink
           
        };
        res.status(200).send(response)
    } catch (error) {
        res.status(404).send({ message: error.message })
    }
});




productsRouter.get('/:id', async(req, res) =>{
    const product = await Product.findById(req.params.id).lean()
    res.json(product)

})


productsRouter.post('/', async(req, res) =>{
    try{
        const product = await Product.create(req.body)
        res.status(201).json(product)
    } catch(error){
        res.status(400).json({message: error.message})

    }
})

productsRouter.put('/:id', async (req, res)=>{
    let actualizado
    try{
        actualizado = await Product.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
    } catch(error){
        return res.status(400).json({message: error.message})
    }

    if (!actualizado){
        return res.status(404).json({ message: 'product not found'})
    }

    res.json(actualizado)
})

