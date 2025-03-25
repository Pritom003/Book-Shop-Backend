import { Model, Types } from 'mongoose';

export type TProducts = {
  title: string;
  author: string;
  authorImage?: string; // Optional author image
  price: number;
  category: 'Fiction' | 'Science' | 'SelfDevelopment' | 'Poetry' | 'Religious';
  description: string;
  quantity: number;
  inStock: boolean;
    user: Types.ObjectId;
  bookCover: string; // Book cover image (Required)
};


export interface TProductsModel
  extends Model<TProducts, Record<string, unknown>> {
  findByProductId(productId: string): Promise<TProducts | null>;
}
