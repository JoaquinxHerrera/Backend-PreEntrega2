import { Router } from "express";
import { productManager } from "../../daos/products/products.dao.mongoose.js";
import { cartManager } from "../../daos/carts/cart.dao.mongoose.js";
import { sesionesRouter } from "./sesiones.router.js";
import { usuariosRouter } from "./usuarios.router.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import { SWAGGER_CONFIG } from "../../config/config.js";
import { logger } from "../../utils/logger.js";

export const webRouter = Router()

webRouter.use(sesionesRouter)
webRouter.use(usuariosRouter)

webRouter.get('/', async(req,res)=>{
    return res.redirect('/login')
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

    const result = await productManager.paginate(criterioDeBusqueda, {
        ...opcionesDePaginacion,
        sort: sortOptions 
    });
    logger.info(result)
    res.render('products.handlebars', {
        user: req.user,
        pageTitle: 'Products',
        isAdmin: req.user && req.user.rol === 'admin',
        isUser:req.user && req.user.rol === 'user',
        totalPages: result.docs.length > 0,
        ...result,
    });
})

webRouter.get('/products/:id', async(req, res) =>{
    const product = await productManager.findById(req.params.id).lean()
    

    res.render('product.handlebars', {
        pageTitle: 'Product',
        product: product,
    });
})

webRouter.get('/carts/:cid', async(req, res)=>{
    const cart = await cartManager.findById(req.params.cid).populate('products.product').lean()
    
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    res.render('cart.handlebars', {
        pageTitle: 'Cart',
        cart: cart,
    });
})

 
const spec = swaggerJSDoc(SWAGGER_CONFIG)
webRouter.use('/api-docs',
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(spec)
)

