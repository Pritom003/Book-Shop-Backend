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
  price: z
    .number()
    .min(0, 'Price cannot be negative.'),
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
    .min(0, 'Quantity cannot be negative.'),
  inStock: z.boolean().default(true),
});
