import { model, Schema } from 'mongoose';
import { TProducts } from './Products.interface';

// Create the Mongoose schema
const ProductsSchema = new Schema<TProducts>(
  {
    title: { 
      type: String, 
      required: [true, 'Title is required.'], 
      minlength: [3, 'Title must be at least 3 characters long.'],
      maxlength: [100, 'Title cannot exceed 100 characters.']
    },
    author: { 
      type: String, 
      required: [true, 'Author is required.'], 
      minlength: [3, 'Author name must be at least 3 characters long.'],
      maxlength: [50, 'Author name cannot exceed 50 characters.']
    },
    price: { 
      type: Number, 
      required: [true, 'Price is required.'], 
      min: [0, 'Price cannot be negative.'] 
    },
    category: { 
      type: String, 
      required: [true, 'Category is required.'], 
      enum: {
        values: ['Fiction', 'Science', 'SelfDevelopment', 'Poetry', 'Religious'],
        message: '[VALUE] this category cant be added'
      } 
    },
    description: { 
      type: String, 
      required: [true, 'Description is required.'], 
      minlength: [10, 'Description must be at least 10 characters long.'],
      maxlength: [1000, 'Description cannot exceed 1000 characters.']
    },
    quantity: { 
      type: Number, 
      required: [true, 'Quantity is required.'], 
      min: [0, 'Quantity cannot be negative.'] 
    },
    inStock: { 
      type: Boolean, 
      required: [true, 'InStock status is required.'], 
      default: true 
    },
  },
  { timestamps: true }
);

const ProductsModel = model<TProducts>('Products', ProductsSchema);
export default ProductsModel;
