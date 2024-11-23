import { TOrder } from "./Orders.interface";
import OrdersModel from "./Orders.models";

const createOrdersTooDB = async (Orderdata : TOrder) => {
    const result = await OrdersModel.placeOrder(Orderdata);
    return result;
  };
// Service method to calculate total revenue from all orders
const calculateRevenue = async () => {
    try {
      const revenueData = await OrdersModel.aggregate([
        {
          $lookup: {
            from: "products", 
            localField: "product",  
            foreignField: "_id",  
            as: "productDetails",  
          },
        },
        {
          $unwind: "$productDetails",  
        },
        {
          $project: {
            productName: "$productDetails.name",  
            productPrice: "$productDetails.price",  
            quantity: 1,  
            totalOrderRevenue: { $multiply: ["$productDetails.price", "$quantity"] },  
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalOrderRevenue" },  
          },
        },
      ]);
  
      const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
      return totalRevenue;
    } catch (err: any) {
      console.error("Error calculating revenue:", err);
      throw new Error(err.message);
    }
  };
  
  
  export const OrdersServices = {
    createOrdersTooDB,
    calculateRevenue,
  };