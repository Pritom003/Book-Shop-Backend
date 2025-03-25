import { Request, Response } from 'express';
import { ProductsServices } from './Products.service';
import CatchAsync from '../Utils/CatchAsync';
// import { ProductValidator } from "./Products.validatio";


// ✅ Properly using CatchAsync
const createProducts = CatchAsync(async (req: Request, res: Response) => {
  const products = req.body;
  const user = req.user;
  if (!user) {
    res.status(500).json({
      success: true,
      message: 'user not found',
      data: '',
    });
    return;
  }
  console.log(user, '📌 Logged-in user creating the book');

  const files = req.files as any;

  // ✅ Wait for product creation
  const result = await ProductsServices.createProductsTooDB(files, products, user);

  res.status(200).json({
    success: true,
    message: 'Book added successfully',
    data: result,
  });
});


export const getAllProducts = async (req: Request, res: Response) => {
  try {
    // Extract query parameters
    const { searchTerm, category, page, limit, minPrice, maxPrice } = req.query;

    // Convert price values to numbers if they exist
    const min = minPrice ? parseFloat(minPrice as string) : undefined;
    const max = maxPrice ? parseFloat(maxPrice as string) : undefined;

    // Pass the parameters to the service
    const result = await ProductsServices.getAllProducts(
      searchTerm as string,
      parseInt(page as string, 10) || 1, // Default to 1 if page is not provided
      parseInt(limit as string, 10) || 10, // Default to 10 if limit is not provided
      category as string,
      undefined, // isNewArrival (if needed, extract it)
      min, // ✅ Pass minPrice
      max  // ✅ Pass maxPrice
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
    const files = req.files as any;
    const result = await ProductsServices.updateProduct(files,productId, body);

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
