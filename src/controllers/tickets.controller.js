import passport from "passport";
import { Cart } from "../daos/carts/cart.dao.mongoose.js";
import { Product } from "../daos/products/products.dao.mongoose.js";
import { ticketDaoMongoose } from "../daos/tickets/ticket.dao.mongoose.js"


export async function createOrderController(req, res){
    try{
            const user = req.user
            const cart = req.user.cart;

            if (!cart) {
                return res.status(404).json({ status: 'error', message: 'Cart not found for user' });
            }

            let totalAmount = 0;
            let productsInStock= []

            for (const item of cart.products) {
                const productId = item._id;
                const quantity = item.quantity;
                const product = await Product.findById(productId).lean();
                if (!product) {
                    return res.status(404).json({ status: 'error', message: `Product with ID ${productId} not found` });
                }
                if(product.stock >= quantity){
                    const price = product.price;
                    totalAmount += quantity * price;
                    productsInStock.push({product, quantity})
                }
            }

            if (productsInStock.length === 0){
                return res.status(400).json({status:'error', message: 'No products in stock'})
            }
            
            const ticketData = {
                amount: totalAmount,
                purchaser: user.email,

            };

            const ticket = await ticketDaoMongoose.create(ticketData);

            const updatedCart = cart.products.filter(item => !productsInStock.some(({ product }) => product._id.toString() === item._id.toString()))
            await Cart.updateOne({ _id: cart._id }, { products: updatedCart });

            for(const item of cart.products){
                const productId = item._id;
                const quantity = item.quantity;

                await Product.findByIdAndUpdate(productId, {$inc: {stock: -quantity}})
            }
            res.status(201).json({ status: 'success', message: 'Order created successfully', ticket });
        ;
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
}