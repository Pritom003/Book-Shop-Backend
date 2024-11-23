import { Types, Model } from 'mongoose';

// Define the structure of the order document
export type TOrder = {
  email: string;  
  product: Types.ObjectId; 
  quantity: number;  
  totalPrice: number; 
};

// Define the static method for the model
export interface OrderModel extends Model<TOrder> {
  placeOrder(orderData: TOrder): Promise<TOrder>;
}
