import { TProducts } from './Products.interface';
import ProductsModel from './Products.models';

const createProductsTooDB = async (Products: TProducts) => {
  const result = await ProductsModel.create(Products);
  return result;
};

const getAllProducts = async () => {
  const result = await ProductsModel.find();
  return result;
};


// Get a single product by productId
const getSingleProduct = async (productId: string) => {
  try {
    const result = await ProductsModel.findByProductId(productId);  // Use custom static method here
    if (!result) {
      throw new Error('Product not found');
    }
    return result;
  } catch (error:any) {
    throw new Error(error.message);
  }
};


// Update a product by its ID
const updateProduct = async (id: string, data: TProducts) => {
  try {
  const result = await ProductsModel.findByIdAndUpdate(id, data, { new: true });
  if (!result) {
    throw new Error('Product not found');
  }
  return result;
} catch (error:any) {
  throw new Error(error.message);
}
};


// Delete a product by its ID
const deleteProduct = async (productId: string) => {
  try{
  const result = await ProductsModel.findByIdAndDelete(productId);
  if (!result) {
    throw new Error('Product not found');
  }
  return result;
} catch (error:any) {
  throw new Error(error.message);
}

};


export const ProductsServices = {
  createProductsTooDB,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
