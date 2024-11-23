import { TProducts } from "./Products.interface";
import ProductsModel from "./Products.models";


const createProductsTooDB = async (Products :TProducts) => {
    const result = await ProductsModel.create(Products);
    return result;
  };

const getAllProducts = async () => {
    const result = await ProductsModel.find();
    return result;
  };

  const getSingleProduct = async (productId: string) => {

      const result = await ProductsModel.findOne({ _id: productId });
      return result;
 
  };
  const updateProduct = async (id: string, data: TProducts) => {
    const result = await ProductsModel.findByIdAndUpdate(id, data,
 {
      new: true,
    })
    return result
  }

  const deleteProduct = async (productId: string) => {
    const result = await ProductsModel.findByIdAndDelete(productId)
    return result
  }
  

  export const ProductsServices = {
    createProductsTooDB,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
  };