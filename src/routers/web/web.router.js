import { Router } from "express";
import { productManager } from "../../daos/products/products.dao.mongoose.js";
import { sesionesRouter } from "./sesiones.router.js";
import { usuariosRouter } from "./usuarios.router.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import { SWAGGER_CONFIG } from "../../config/config.js";
import { logger } from "../../utils/logger.js";
import { isAdmin, onlyLoggedWeb } from "../../middlewares/authorization.js";
import { cartService } from "../../daos/mongodb.js";
import { userService } from "../../services/index.js";

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
        ...req.user,
        pageTitle: 'Products',
        isAdmin: req.user && req.user.rol === 'admin',
        isLogged:req.user && req.user.rol === 'user',
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

webRouter.get('/carts', onlyLoggedWeb, (req, res)=>{
    res.status(400).send('Cart ID is required')
})

webRouter.get('/carts/:cid', onlyLoggedWeb, async(req, res)=>{
    const {cid} = req.params
    const cart = await cartService.getCartById({_id: cid})
    
    
    // result.products;
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    const products = cart.products
    const productInfo = []
    let total = 0;

    products.forEach(product => {
        const thumbnail = product.thumbnail
        const productId = product._id
        const quantity = product.quantity
        const title = product.title
        const price = product.price
        const subtotal = price * quantity
        productInfo.push({productId, quantity, thumbnail, title, price, subtotal, cartId: cid})
    
        total += subtotal;
    })
    res.render('cart.handlebars', {
        pageTitle: 'Cart',
        products: productInfo,
        productsInCart: productInfo.length > 0,
        cartId: cid,
        total,
        ...req.user,
    });
})

webRouter.get('/users', isAdmin, async(req, res, next)=>{
    const userList = await userService.getUsers()
    res.render('users.handlebars', {
        pageTitle: 'Cart',
        users: userList

    })
})

 
const spec = swaggerJSDoc(SWAGGER_CONFIG)
webRouter.use('/api-docs',
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(spec)
)

