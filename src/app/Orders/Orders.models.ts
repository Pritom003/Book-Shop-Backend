import mongoose, { model, Schema } from 'mongoose';
import { OrderModel, TOrder } from './Orders.interface';
import ProductsModel from '../Books/Products.models';

const OrderSchema = new Schema<TOrder, OrderModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Products',
          required: [true, 'Product reference is required'],
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
          min: [1, 'Quantity must be at least 1'],
        },
      }
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    transaction: {
      id: String,
      transactionStatus: String,
      bank_status: String,
      sp_code: String,
      sp_message: String,
      method: String,
      date_time: String,
    },
  },
  { timestamps: true },
);

// Add static method to place an order
OrderSchema.static('placeOrder', async function (orderData: TOrder) {
  try {
    let totalPrice = 0;
    
    // Loop through each product in the order and process it
    for (const item of orderData.products) {
      const product = await ProductsModel.findById(item.product);
      if (!product) {
        throw new Error(`Invalid product ID: Product not found for ${item.product}.`);
      } else if (product.quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for product ${item.product}. Only ${product.quantity} items are in stock.`,
        );
      } else {
        totalPrice += product.price * item.quantity;

        // Update the product stock after the order is placed
        product.quantity -= item.quantity;
        await product.save();
      }
    }

    // Create the order with the calculated total price
    const order = await this.create({ ...orderData, totalPrice });

    return order;
  } catch (error: any) {
    throw new Error(error.message);
  }
});


const OrdersModel = model<TOrder, OrderModel>('Order', OrderSchema);
export default OrdersModel;
