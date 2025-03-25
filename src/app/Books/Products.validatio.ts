import { z } from 'zod';

export const ProductValidator = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long.')
    .max(100, 'Title cannot exceed 100 characters.')
    .nonempty('Title is required.'),
  
  author: z
    .string()
    .min(3, 'Author name must be at least 3 characters long.')
    .max(50, 'Author name cannot exceed 50 characters.')
    .nonempty('Author is required.'),
  
  authorImage: z
    .string()
    .optional()
    .nullable(),
  
  price: z
    .number()
    .min(0, 'Price cannot be negative.')
    .nonnegative('Price must be a positive number.')
    .refine(value => value >= 0, { message: 'Price cannot be negative.' }),
  
  category: z
    .enum(['Fiction', 'Science', 'SelfDevelopment', 'Poetry', 'Religious'], {
      errorMap: () => ({ message: 'Invalid category provided.' }),
    }),

  
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long.')
    .max(1000, 'Description cannot exceed 1000 characters.')
    .nonempty('Description is required.'),
  
  quantity: z
    .number()
    .min(0, 'Quantity cannot be negative.')
    .int('Quantity must be an integer.')
    .refine(value => value >= 0, { message: 'Quantity cannot be negative.' }),
  
  inStock: z
    .boolean()
    .default(true), // default value as per the model
  
  bookCover: z
    .string()
    .nonempty('Book cover image is required.')
    .url('Book cover URL must be a valid URL.'),
});
