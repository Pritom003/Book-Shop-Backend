import express from 'express';
import { OrderControllers } from './Orders.controllers';


const Orderrouter = express.Router();
// call the controller
Orderrouter.post('/', OrderControllers.createOrders );
Orderrouter.get('/revenue', OrderControllers.getOrderRevenue );
export default Orderrouter;