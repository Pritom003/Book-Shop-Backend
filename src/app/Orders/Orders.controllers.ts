import { Request, Response } from 'express';
import { OrdersServices } from './Orders.services';
import CatchAsync from '../Utils/CatchAsync';
import sendResponse from '../Utils/sendResponse';

// Controller method for creating an order
const createOrders = async (req: Request, res: Response) => {
  try {
    console.log("Incoming request body:", JSON.stringify(req.body, null, 2)); // ✅ Log request body

    const { user, products } = req.body;
    if (!user) throw new Error("User not found");

    if (!products || !Array.isArray(products) || products.length === 0) {
      throw new Error("Products array is missing or empty");
    }

    const data = await OrdersServices.createOrder(user, { products }, req.ip!);

    res.status(200).json({
      success: true,
      message: "Order placed successfully",
      data: data,
    });
  } catch (err: any) {
    console.error("Order creation error:", err); // ✅ Log errors
    res.status(400).json({
      success: false,
      message: err.message || "Something went wrong while placing the order",
      error: err,
    });
  }
};
const verifyPayment = CatchAsync(async (req, res) => {
  const { order_id } = req.params;  // Make sure to use params for dynamic route
  const order = await OrdersServices.verifyPayment(order_id);


  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Order verified successfully',
    data: order,
  });
});


export const getAllOrders = CatchAsync(async (req: Request, res: Response) => {
  // const { productId } = req.params;
  const allOrders = await OrdersServices.getOrders();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Orders retrieved successfully',
    data: allOrders,
  });
});
const getOrderByTransactionId = CatchAsync(async (req: Request, res: Response) => {
  const { order_id } = req.params; // Get transaction_id from URL params

  // Call service to find the order by transaction ID
  const order = await OrdersServices.findOrderByTransactionId(order_id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Order found successfully',
    data: order,
  });
});



// Delete a product by :productId
const deleteOrder = async (req: Request, res: Response) => {
 
    const orderId = req.params.orderId;
    await OrdersServices.deleteOrder(orderId);
    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
      data: {},
    });
  
};
// Controller method for getting order revenue
const getOrderRevenue = async (req: Request, res: Response) => {
  try {
    // Call the service method to calculate total revenue
    const totalRevenue = await OrdersServices.calculateRevenue();

    res.status(200).json({
      success: true,
      message: 'Revenue calculated successfully',
      data: {
        totalRevenue,
      },
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || 'Something went wrong while calculating revenue',
      error: err,
    });
  }
};
const getBestProducts = async (req: Request, res: Response) => {
  
    // Call the service method to calculate total revenue
    const topProducts = await OrdersServices.getTopOrderedProducts();

    res.status(200).json({
      success: true,
      message: 'Top books got  successfully',
      data: topProducts
    })}
   const getUserOrders = async (req: Request, res: Response) => {
     
        const userId = req.params.userId;
        console.log(userId ,'this is my user id '); // Get userId from request params
        const orders = await OrdersServices.getOrdersByUser(userId);
        res.status(200).json({
          success: true,
          message: 'Order retrive successfully',
          data: 
            orders,
          
        });
    
    };
export const OrderControllers = {
  createOrders,
  getOrderRevenue,verifyPayment,  getOrderByTransactionId,getAllOrders,deleteOrder,getBestProducts,getUserOrders
};
