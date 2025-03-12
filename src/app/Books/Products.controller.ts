import { Request, Response } from 'express';
import { ProductsServices } from './Products.service';
// import { ProductValidator } from "./Products.validatio";

// create
const createProducts = async (req: Request, res: Response) => {
  try {
    // receiving data from frontend
    const Products = req.body;


    // sending  Productss to  services without z validatoin
    const result = await ProductsServices.createProductsTooDB(Products);

    res.status(200).json({
      success: true,
      message: 'Books added successfully',
      data: result,
    });
  } catch (err) {
    // error in sending data

    res.status(500).json({
      success: false,
      message: 'something went wrong',
      data: err,
    });
  }
};

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    // Extract search term from query parameters
    const { searchTerm, category, page, limit } = req.query;

    // Pass the parameters to the service
    const result = await ProductsServices.getAllProducts(
      searchTerm as string,
      parseInt(page as string, 10) || 1, // Default to 1 if page is not provided
      parseInt(limit as string, 10) || 10, // Default to 10 if limit is not provided
      category as string
    );

    res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      data: err.message,
    });
  }
};

// Get a single product by :productId
const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const result = await ProductsServices.getSingleProduct(productId);
    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err.message,
    });
  }
};

// Update a product by :productId
const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const body = req.body;
    const result = await ProductsServices.updateProduct(productId, body);

    // If the product is found, return it
    res.status(200).json({
      success: true,
      message: 'Product upadate successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err.message,
    });
  }
};

// Delete a product by :productId
const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    await ProductsServices.deleteProduct(productId);
    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message,
    });
  }
};

export const ProductsControllers = {
  createProducts,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
