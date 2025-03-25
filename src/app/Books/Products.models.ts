import { model, Schema } from 'mongoose';
import { TProductsModel, TProducts } from './Products.interface';

// Create the Mongoose schema
const ProductsSchema = new Schema<TProducts, TProductsModel>(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      minlength: [3, 'Title must be at least 3 characters long.'],
      maxlength: [100, 'Title cannot exceed 100 characters.'],
    },
    author: {
      type: String,
      required: [true, 'Author is required.'],
      minlength: [3, 'Author name must be at least 3 characters long.'],
      maxlength: [50, 'Author name cannot exceed 50 characters.'],
    },
    authorImage: {
      type: String, // URL for the author image
      default: null, // Optional field
    },
    price: {
      type: Number,
      required: [true, 'Price is required.'],
      min: [0, 'Price cannot be negative.'],
    },
    category: {
      type: String,
      required: [true, 'Category is required.'],
      enum: {
        values: ['Fiction', 'Science', 'SelfDevelopment', 'Poetry', 'Religious'],
        message: '[VALUE] this category cant be added',
      },
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
      minlength: [10, 'Description must be at least 10 characters long.'],
      maxlength: [1000, 'Description cannot exceed 1000 characters.'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required.'],
      min: [0, 'Quantity cannot be negative.'],
    },
    inStock: {
      type: Boolean,
      required: [true, 'InStock status is required.'],
      default: true,
    },
    bookCover: {
      type: String, // URL for the book cover image
      required: [true, 'Book cover image is required.'],
    },
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  },
  { timestamps: true }
);
// Pre-hook for search functionality
ProductsSchema.pre('find', function (next) {
  const searchTerm = this.getQuery().searchTerm;
  if (searchTerm) {
    const regex = new RegExp(searchTerm, 'i');

    // Search by title, author, or category
    this.or([
      { title: { $regex: regex } },
      { author: { $regex: regex } },
      { category: { $regex: regex } },
    ]);
  }
  next();
});

// Static method to find a product by its ID
ProductsSchema.statics.findByProductId = async function (productId: string) {
  try {
    const existingProduct = await this.findById(productId);
    if (!existingProduct) {
      throw new Error('Product not found');
    }
    return existingProduct;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Create and export the model
const ProductsModel = model<TProducts, TProductsModel>(
  'Products',
  ProductsSchema,
);
export default ProductsModel;
