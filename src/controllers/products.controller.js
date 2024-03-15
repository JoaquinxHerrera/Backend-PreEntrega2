import { productService } from "../daos/mongodb.js"
import { productManager } from "../daos/products/products.dao.mongoose.js"




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
            nextLinl: data.nextLink
           
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

export async function postController(req, res){
    try{
        const product = await productService.addProduct(req.body, req.user.email )
        res.status(200).json(product)
    }catch (error) {
        res.status(400).json({message: error.message})
    }
}

export async function putController(req, res){
    const {id} = req.params
    const updatedFields = req.body
    try{
       await productService.updateProduct(id, updatedFields)
        res.json(id)
    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export async function deleteController(req, res){
    const {id} = req.params
    try{
        const product = await productService.deleteProduct(id)
        res.json(product)
    }catch(error){
        res.status(404).json({message: error.message})
    }
}
    