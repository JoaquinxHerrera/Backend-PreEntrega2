import { pm } from "../services/ProductsManager.js"

export async function getController  (req, res){
    try {
        const products = await pm.getProducts(req.query);
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export async function getIdController (req, res){
    const id = Number(req.params.id)
    try{
        const buscado = await pm.getProductById(id)
        res.json(buscado)
    } catch(error){
        res.status(404).json({
            message: error.message
        })
    } 
}

export async function postController(req, res){
    try{
        console.log('add product' )
        const product = req.body
        console.log(product)
        await pm.addProduct(product)
        res.json(product)
    }catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export async function putController(req, res){
    const id = Number(req.params.id)
    const updatedFields = req.body
    try{
        const buscado = await pm.updateProduct(id, updatedFields)
        res.json(buscado)
    }catch(error){
        res.status(500).json({error: 'Error interno del servidor'})
    }
}

export async function deleteController(req, res){
    const id = Number(req.params.id)
    try{
        const deleted = await pm.deleteProduct(id)
        res.json(deleted)
    }catch(error){
        res.status(500).json({error:'Error interno del servidor'})
    }
}
    