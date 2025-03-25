

import OrdersModel from './Orders.models';
import { UserInterface } from '../User/user.Interface';
import AppError from '../Errors/AppErrors';
import ProductsModel from '../Books/Products.models';
import { orderUtils } from './Order.utils';
import { User } from '../User/user.model';
import config from '../config';
import ReviewModel from '../Review/Review.models';



const createOrder = async (
  user: UserInterface,
  payload: { products: { product: string; quantity: number }[] },
  client_ip: string
) => {
  if (!payload?.products || payload.products.length === 0) {
    throw new AppError(404, "Order is not specified");
  }

  const products = payload.products;
  let totalPrice = 0;
  const productDetails = await Promise.all(
    products.map(async (item) => {
      if (!item.product || !item.quantity) {
        return null;
      }

      const product = await ProductsModel.findById(item.product);
      if (!product) {
        return null;
      }

      const subtotal = product.price * item.quantity;
      totalPrice += subtotal;

      return { product: product._id, quantity: item.quantity };
    })
  );

  const validProducts = productDetails.filter((p) => p !== null);

  if (validProducts.length === 0) {
    throw new AppError(400, "No valid products found for this order");
  }

  let order = await OrdersModel.create({
    user,
    products: validProducts,
    totalPrice,
  });

  const customer = await User.findById(user);
  const shurjopayPayload = {
    amount: totalPrice,
    order_id: order._id,
    currency: "BDT",
    customer_name: customer?.name,
    customer_address: "Sylhet",
    customer_email: customer?.email,
    customer_phone: "01872210075",
    customer_city: "Sylhet",
    client_ip,
    return_url: config.sp_return_url, // ✅ Ensure this is used
    
  };
  

  try {

    const payment = await orderUtils.makePaymentAsync(shurjopayPayload);
    console.log(payment);
    if (payment?.transactionStatus === 'Success') {
      order = await order.updateOne({
        transaction: {
          id: payment.sp_order_id,
          transactionStatus: payment.transactionStatus,
        },
      });
    } else if (payment?.transactionStatus === 'Initiated') {
      // Handle the initiated state - Maybe set the order as "Pending" or ask the user to complete the payment
   
  if (payment?.transactionStatus) {
    order = await order.updateOne({
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus,
      },
    });
  }
         return payment.checkout_url;
    } else {
      throw new AppError(500, "Payment failed. Please try again.");
    }

    return payment.checkout_url;
  } catch (error) {
    throw new AppError(500, (error as Error)?.message || "An error occurred during the payment process.");
  }
};







const getOrders = async () => {
  const data = await OrdersModel.find().populate('products.product')  .populate('user');
  return data;
};

// service method to find order by transaction ID
const findOrderByTransactionId = async (transactionId: string) => {
  try {
    const order = await OrdersModel.findOne({
      'transaction.id': transactionId,
    }) .populate('products.product')  .populate('user'); 

    if (!order) {
      throw new AppError(404, 'Order not found with this transaction ID.');
    }

    return order;
  } catch (error) {
    throw new AppError(500, (error as Error)?.message || "Something went wrong while fetching the order");
    
  }
};
const getOrdersByUser = async (userId: string) => {
  try {
    console.log("Fetching orders for user:", userId); // Debugging log

    if (!userId) {
      throw new AppError(400, "User ID is required.");
    }

    const orders = await OrdersModel.find({ user: userId })
      .populate("products.product")
      .populate("user")
      .sort({ createdAt: -1 });

    if (!orders.length) {
      console.log("No orders found for user:", userId);
      return []; // ✅ Return an empty array instead of throwing an error
    }

    return orders;
  } catch (error) {
    console.error("Database error:", error); // Log actual error
    throw new AppError(500, "Failed to fetch user orders.");
  }
};




const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    const order = await OrdersModel.findOneAndUpdate(
      { 'transaction.id': order_id },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
            ? 'Pending'
            : verifiedPayment[0].bank_status == 'Cancel'
            ? 'Cancelled'
            : '',
      },
      { new: true }
    ).populate('products.product')  .populate('user');

    // ✅ Deduct product quantity if payment is successful
    if (verifiedPayment[0].bank_status === 'Success' && order) {
      for (const item of order.products) {
        const product = await ProductsModel.findById(item.product);
        if (product) {
          product.quantity -= item.quantity;
          if (product.quantity < 0) product.quantity = 0; // Ensure it doesn't go negative
          await product.save();
        }
      }
    }
  }

  return verifiedPayment;
};





// Service method to calculate total revenue from all orders
const calculateRevenue = async () => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed in JS

    const revenueData = await OrdersModel.aggregate([
      {
        $match: {
          status: { $in: ['Paid', 'Completed'] }, // Only successful orders
        },
      },
      {
        $project: {
          totalPrice: 1,
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          monthlyRevenue: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$year", currentYear] }, { $eq: ["$month", currentMonth] }] },
                "$totalPrice",
                0,
              ],
            },
          },
          yearlyRevenue: {
            $sum: {
              $cond: [{ $eq: ["$year", currentYear] }, "$totalPrice", 0],
            },
          },
        },
      },
    ]);

    const revenue = revenueData.length > 0 ? revenueData[0] : { totalRevenue: 0, monthlyRevenue: 0, yearlyRevenue: 0 };
    
    // Formatting the return object to include month/year
    return {
      totalRevenue: revenue.totalRevenue,
      monthlyRevenue: revenue.monthlyRevenue,
      yearlyRevenue: revenue.yearlyRevenue,
      currentMonth: currentMonth,
      currentYear: currentYear,
    };
  } catch (err: any) {
    throw new Error(err.message);
  }
};

const getTopOrderedProducts = async () => { 
  try {
    const topProducts = await OrdersModel.aggregate([
      { $unwind: "$products" }, // Unwind the products array
      {
        $group: {
          _id: "$products.product", // Group by product ID (product reference)
          totalQuantity: { $sum: "$products.quantity" }, // Sum the quantity of each product
        },
      },
      { $sort: { totalQuantity: -1 } }, // Sort by totalQuantity in descending order
      { $limit: 6 }, // Get the top 5 products
    ]).exec(); // Execute the aggregation query

    // Populate product details
    const populatedProducts = await OrdersModel.populate(topProducts, {
      path: "_id",
      model: "Products",
    });

    // Fetch reviews and calculate average rating
    const productsWithRatings = await Promise.all(
      populatedProducts.map(async (product: any) => {
        const reviews = await ReviewModel.find({ productId: product._id });

        const avgRating = reviews.length
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
          : 0;

        return {
          _id: product._id?._id || "",
          productCover: product._id?.bookCover || "", 
          name: product._id?.title || "Unknown Product", 
          totalQuantity: product._id?.quantity ,
          price: product._id?.price || 0,
          avgRating, // Include average rating
        };
      })
    );

    return productsWithRatings;
  } catch (error: any) {
    throw new Error(error.message);
  }
};






const deleteOrder = async (OrderID: string) => {
  try {
    const result = await OrdersModel.findByIdAndDelete(OrderID);
    if (!result) {
      throw new Error('Order not found');
    }
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
// export const OrdersServices = {
//   createOrder,
//   ,getOrders,deleteOrder,verifyPayment
// };
export const OrdersServices = {
  createOrder,
  getOrders,
  verifyPayment,calculateRevenue,deleteOrder,
  findOrderByTransactionId,getTopOrderedProducts
,getOrdersByUser
};
