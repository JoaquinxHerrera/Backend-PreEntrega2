import { Router } from "express";
import { Product } from "../../daos/products/products.dao.mongoose.js";
import { onlyLoggedWeb } from "../../middlewares/authorization.js";
import { Cart } from "../../daos/carts/cart.dao.mongoose.js";
import { sesionesRouter } from "./sesiones.router.js";
import { usuariosRouter } from "./usuarios.router.js";
import { restablecerContrasena, solicitarRecuperacionContrasena } from "../../controllers/passwordReset.controller.js";

export const webRouter = Router()

webRouter.use(sesionesRouter)
webRouter.use(usuariosRouter)

webRouter.get('/', async(req,res)=>{
    return res.redirect('/login')
})

webRouter.get('/recuperar-contrasena', async (req, res) => {
    res.render('recuperar-contrasena.handlebars', { pageTitle: 'Recuperar Contraseña' });
});

webRouter.post('/recuperar-contrasena', async (req, res) => {
    const { email } = req.body;
    try {
        await solicitarRecuperacionContrasena(email, res);
        res.render('confirmacion-recuperacion.handlebars', { pageTitle: 'Recuperación Solicitada' });
    } catch (error) {
        console.error(error);
        res.render('error.handlebars', { pageTitle: 'Error', error });
    }
});

// Ruta para restablecer la contraseña con un token
webRouter.get('/restablecer-contrasena/:token', async (req, res) => {
    const { token } = req.params;
    res.render('restablecer-contrasena.handlebars', { pageTitle: 'Restablecer Contraseña', token });
});

// Manejar la solicitud de restablecimiento de contraseña
webRouter.post('/restablecer-contrasena/:token', async (req, res) => {
    const { token } = req.params;
    const { nuevaContrasena } = req.body;
    try {
        const resultado = await restablecerContrasena(token, nuevaContrasena);
        if (resultado.success) {
            res.render('confirmacion-restablecimiento.handlebars', { pageTitle: 'Contraseña Restablecida' });
        } else {
            res.render('error.handlebars', { pageTitle: 'Error', error: resultado.message });
        }
    } catch (error) {
        console.error(error);
        res.render('error.handlebars', { pageTitle: 'Error', error });
    }
});

webRouter.get('/products', onlyLoggedWeb, async (req,res, next)=>{
    
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
        ...req.session['user'],
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

