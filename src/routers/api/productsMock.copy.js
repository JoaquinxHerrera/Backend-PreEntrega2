import { Router } from "express";
import { ProductsDaoMock } from "../../daos/products/mock/products.dao.mock.js";

const productsDaoMock = new ProductsDaoMock()
export const productsMockRouter = Router()

productsMockRouter.get('/', async (req, res)=>{
    res.json(await productsDaoMock.readMany())
})
