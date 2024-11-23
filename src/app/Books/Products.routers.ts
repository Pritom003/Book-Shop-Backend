import express from 'express';
import { ProductsControllers } from './Products.controller';

const Productsrouter = express.Router();
// call the controller
Productsrouter.post('/', ProductsControllers.createProducts);

Productsrouter.get('/:productId', ProductsControllers.getSingleProduct);
Productsrouter.put('/:productId', ProductsControllers.updateProuct);
Productsrouter.delete('/:productId', ProductsControllers.deleteProduct);
Productsrouter.get('/', ProductsControllers.getAllProducts);

export default Productsrouter;
