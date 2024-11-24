import { Model } from "mongoose";


export type TProducts = {
  title: string;
  author: string;
  price: number;
  category: 'Fiction' | 'Science' | 'SelfDevelopment' | 'Poetry' | 'Religious';
  description: string;
  quantity: number;
  inStock: boolean;
};

export interface TProductsModel extends Model<TProducts, Record<string, unknown>> {
  findByProductId(productId: string): Promise<TProducts | null>;

}