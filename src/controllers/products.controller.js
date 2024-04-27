import { productService } from "../daos/mongodb.js"
import { productManager } from "../daos/products/products.dao.mongoose.js"
import { isAdmin } from "../middlewares/authorization.js"
import { productsRouter } from "../routers/api/products.router.js"
import { sendDeleteMailController } from "./mails.controller.js"




export async function getController  (req, res, next){
    const paginationOptions = {
        limit: req.query.limit || 10,
        page: req.query.page || 1,
        lean: true
    }

    const query ={}
    
    if (req.query.title) {query.title = req.query.title}
    if (req.query.category) {query.category = req.query.category}
    if (req.query.status !== undefined){query.status = req.query.status === "true"}
    
    const sortOptions = {};
    if (req.query.sort) {
        sortOptions.price = req.query.sort === 'desc' ? -1 : 1;
    }

    try {
        const data = await productManager.paginate(query, {
            ...paginationOptions,
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
            nextLink: data.nextLink
           
        };
        res.status(200).send(response)
    } catch (error) {
        res.status(404).send({ message: error.message })
    }
}

export async function getIdController (req, res){
    const id = req.params.id
    try{
        const productById = await productService.getProductById(id)
        return res.json({productById})
    } catch(error){
        res.status(404).json({message: error.message})
    } 
}

export async function postController(req, res, next){
    try{
        const product = await productService.addProduct(req.body, req.user.email )
        res.status(200).json(product)
    }catch (error) {
        next(error)
    }
}

export async function putController(req, res){
    const {id} = req.params
    const updatedFields = req.body
    const userEmail = req.user.email
    const userRole = req.user.rol
    try{
        const product = await productService.getProductById(id)

        if(product.owner !== userEmail && userRole !== "admin"){
            return res.status(403).json({message: "You are not allowed to modify this products"})
        }
       await productService.updateProduct(id, updatedFields)
        res.json(id)
    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export async function deleteController(req, res, next){
    const {id} = req.params
    const userEmail = req.user.email
    const userRole = req.user.rol
    try{
        const product = await productService.getProductById(id)
        if(product.owner != userEmail && userRole !== "admin"){
            return res.status(403).json({message: "You are not allowed to delete this products"})
        }
       
        const deletedProduct = await productService.deleteProduct(id)
        const owner = deletedProduct.owner

        if(owner !== 'admin'){
            await sendDeleteMailController(owner, deletedProduct)
        }

        res.status(200).json({message: "Product deleted successfully"})
    }catch(error){
        res.status(404).json({message: error.message})
    }
}



    