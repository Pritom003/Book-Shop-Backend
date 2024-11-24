import { Request, Response } from 'express';
import { OrdersServices } from './Orders.services';

// Controller method for creating an order
const createOrders = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;

    // Call the service method to place the order
    const result = await OrdersServices.createOrdersTooDB(orderData);

    res.status(200).json({
      success: true,
      message: 'Order placed successfully',
      data: result,
    });
  } catch (err: any) {
    
    res.status(400).json({
      success: false,
      message: err.message || 'Something went wrong while placing the order',
      error: err, 
    });
  }
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

export const OrderControllers = {
  createOrders,
  getOrderRevenue,
};
