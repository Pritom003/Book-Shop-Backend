import express from 'express';
import { OrderControllers } from './Orders.controllers';
import auth from '../Middleware/auth';
import { USER_ROLE } from '../User/user.const';

const Orderrouter = express.Router();

Orderrouter.get('/verify/:order_id', OrderControllers.verifyPayment);
Orderrouter.get('/', OrderControllers.getAllOrders);

Orderrouter.post('/', OrderControllers.createOrders);
Orderrouter.delete('/:orderId', auth(USER_ROLE.ADMIN), OrderControllers.deleteOrder);
Orderrouter.get('/revenue', OrderControllers.getOrderRevenue);
Orderrouter.get('/top-book', OrderControllers.getBestProducts);
Orderrouter.get('/top-book', OrderControllers.getBestProducts);
Orderrouter.get('/user/:userId', OrderControllers.getUserOrders);
export default Orderrouter;