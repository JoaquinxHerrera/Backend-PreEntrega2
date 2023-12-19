import { Router } from "express";
import { Product } from "../models/Product.js";
import { Cart } from "../models/Cart.js";

export const webRouter = Router()

webRouter.get('/', async(req,res)=>{
    res.redirect('/api/products')
})

webRouter.get('/products', async (req,res, next)=>{
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

    const result = await Product.paginate(criterioDeBusqueda, {
        ...opcionesDePaginacion,
        sort: sortOptions 
    });
    console.log(result)
    res.render('products.handlebars', {
        pageTitle: 'Products',
        totalPages: result.docs.length > 0,
        ...result,
    });
})

webRouter.get('/products/:id', async(req, res) =>{
    const product = await Product.findById(req.params.id).lean()
    

    res.render('product.handlebars', {
        pageTitle: 'Product',
        product: product,
    });
})

webRouter.get('/carts/:cid', async(req, res)=>{
    const cart = await Cart.findById(req.params.cid).populate('products.product').lean()
    
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    res.render('cart.handlebars', {
        pageTitle: 'Cart',
        cart: cart,
    });
})

