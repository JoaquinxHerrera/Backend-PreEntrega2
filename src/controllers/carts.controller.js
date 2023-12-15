import { cm } from "../services/CartManager.js"
import { pm } from "../services/ProductsManager.js"

export async function getIdController(req, res){
    const cid = Number(req.params.cid)
    try{
        const buscado = await cm.getCartById(cid)
        res.json(buscado)
    } catch(error){
        res.status(404).json({
            message: error.message
        })
    } 
}

export async function postController(req, res){
    try{
        console.log('add cart' )
        const cart = req.body
        console.log(cart)
        await cm.addCart(cart)
        res.json(cart)
    }catch(error){
        res.status(404).json({
            message: error.message
        })
    } 
}

export async function postIdController(req,res){
    const cid = Number(req.params.cid)
    const id = Number(req.params.id)
    try {
        const cartBuscado = await cm.getCartById(cid);
        console.log('Cart encontrado:', cartBuscado);

        if (cartBuscado) {
            try {
                const productBuscado = await pm.getProductById(id);
                console.log('Producto encontrado:', productBuscado);

                if (productBuscado) {
                    const existingProduct = cartBuscado.products.find(p => p.id === id);

                    if (existingProduct) {
                        console.log('Producto existente en el carrito. Incrementando cantidad.');
                        existingProduct.quantity++;
                    } else {
                        console.log('Producto no existente en el carrito. Agregando con cantidad 1.');
                        cartBuscado.products.push({
                            id: productBuscado.id,
                            quantity: 1,
                        });
                    }

                    console.log('Actualizando carrito.');
                    await cm.updateCart(cid, cartBuscado);
                } else {
                    console.log(`El producto con ID ${id} no existe.`);
                }
            } catch (error) {
                console.error('Error al obtener el producto:', error);
            }
        }

        res.json(cartBuscado);
    } catch (error) {
        console.error('Error en postIdController:', error);
        res.status(404).json({
            message: error.message
        });
    }
}