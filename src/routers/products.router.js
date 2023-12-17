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
    // res.json(product)

    res.render('product.handlebars', {
        pageTitle: 'Product',
        product: product,
    });
})
