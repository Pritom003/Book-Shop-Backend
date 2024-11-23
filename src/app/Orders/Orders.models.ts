
import mongoose, { model, Schema } from 'mongoose';
import validator from 'validator';
import { OrderModel, TOrder } from './Orders.interface';
import ProductsModel from '../Books/Products.models';

const OrderSchema = new Schema<TOrder, OrderModel>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      validate: {
        validator: function (v: string) {
          return validator.isEmail(v);
        },
        message: '{VALUE} is not a valid email address!',
      },
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative'],
    },
  },
  { timestamps: true }
);

// Add static method to place an order
OrderSchema.static('placeOrder', async function (orderData: TOrder) {
  try {
    // Check if the product exists
    const product = await ProductsModel.findById(orderData.product);
    if (!product) {
      throw new Error('Invalid product ID: Product not found.');
    }else if (product.quantity < orderData.quantity) {
      throw new Error(`Insufficient stock available. Only ${product.quantity} items are in stock.`);
    }else{
    const totalPrice = product.price * orderData.quantity;
    const order = await this.create([{ ...orderData, totalPrice }]);

    // Update the product stock after the order is placed
    product.quantity -= orderData.quantity;
    await product.save();
    return order[0]; 

  }} catch (error: any) {
    throw new Error(error.message);
  }
});

  


const OrdersModel = model<TOrder, OrderModel>('Order', OrderSchema);
export default OrdersModel;
