import express from 'express';
import { ProductsControllers } from './Products.controller';

const Productsrouter = express.Router();

// Setting up routes with appropriate controllers
Productsrouter.post('/', ProductsControllers.createProducts);
Productsrouter.get('/', ProductsControllers.getAllProducts);
Productsrouter.get('/:productId',ProductsControllers.getSingleProduct)

Productsrouter.put('/:productId', ProductsControllers.updateProduct);
Productsrouter.delete('/:productId', ProductsControllers.deleteProduct);

export default Productsrouter;
