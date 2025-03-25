/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import AppError from '../Errors/AppErrors';
import ReviewModel from '../Review/Review.models';
import { UserInterface } from '../User/user.Interface';
import { sendImageToCloudinary } from '../Utils/SendImageToCloudinary';
import { TProducts } from './Products.interface';
import ProductsModel from './Products.models';

const createProductsTooDB = async (files: any, Products: TProducts, user: UserInterface) => { 
  try {
   

    // ✅ Check if the user is blocked
    if (user.is_blocked) {
      throw new AppError(403, "You've been blocked by the admin");
    }

    const authorImageUpload = files.authorImage
      ? await sendImageToCloudinary('author_' + Date.now(), files.authorImage[0].path)
      : undefined;

    const bookCoverUpload = files.bookCover
      ? await sendImageToCloudinary('book_' + Date.now(), files.bookCover[0].path)
      : undefined;

    

    // Attach image URLs to the product data
    Products.authorImage = authorImageUpload?.secure_url || '';
    Products.bookCover = bookCoverUpload?.secure_url || '';

    // Ensure required fields exist
    if (!Products.bookCover) {
      throw new AppError(400, 'Book cover image is required');
    }

    // Save to the database
    const result = await ProductsModel.create(Products);
    console.log('📚 Product successfully saved:', result);
    return result;
  } catch (error: any) {
    // console.error('❌ Error creating product:', error.message);
    throw new AppError(500,  error.message);
  }
};


const getAllProducts = async (
  searchTerm: string,
  page: number = 1,
  limit: number ,
  category: string,
  isNewArrival?: boolean,
  minPrice?: number, 
  maxPrice?: number  
) => {
  try {
    let query: any = {};

    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      query.$or = [
        { title: { $regex: regex } },
        { author: { $regex: regex } },
        { category: { $regex: regex } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (isNewArrival) {
      query.isNewArrival = true; // ✅ Filter only new arrivals
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    const skip = (page - 1) * limit;
    const products = await ProductsModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    // hey gpt can y ou check is the price range is included here

    return {
      products,
      total: await ProductsModel.countDocuments(query),
    };
  } catch (error: any) {
    return { products: [], total: 0 };
  }
};







// Get a single product by productId
const getSingleProduct = async (productId: string) => {
  try {
    const product = await ProductsModel.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Fetch reviews for the product
    const reviews = await ReviewModel.find({ productId });

    // Calculate average rating
    const avgRating = reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    return { ...product.toObject(), avgRating }; // Add avgRating to the product object
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Update a product by its ID
const updateProduct = async (files: any, id: string, data: TProducts) => {
  try {
    // Check if bookCover file is uploaded, if so, upload to Cloudinary
    const bookCoverUpload = files.bookCover
      ? await sendImageToCloudinary('book_' + Date.now(), files.bookCover[0].path)
      : undefined;

    // If a new book cover is uploaded, update the bookCover field
    if (bookCoverUpload) {
      data.bookCover = bookCoverUpload?.secure_url;
    }

    // Update product without requiring bookCover if not uploaded
    const result = await ProductsModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    
    if (!result) {
      throw new Error('Product not found');
    }
    
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};


// Delete a product by its ID
const deleteProduct = async (productId: string) => {
  try {
    const result = await ProductsModel.findByIdAndDelete(productId);
    if (!result) {
      throw new Error('Product not found');
    }
    return result;
  } catch (error: any) {
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
