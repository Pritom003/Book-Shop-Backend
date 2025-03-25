/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import { ProductsControllers } from './Products.controller';
import { upload } from '../Utils/SendImageToCloudinary';
import auth from '../Middleware/auth';

const Productsrouter = express.Router();

// Setting up routes with appropriate controllers
Productsrouter.post(
  '/',auth('ADMIN', 'USER'),
  upload.fields([
    { name: 'authorImage', maxCount: 1 },
    { name: 'bookCover', maxCount: 1 },
  ]),
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      console.log('Raw Request Body:', req.body); // Debugging
      console.log('Uploaded Files:', req.files); // Debugging

      if (req.body.data) {
        req.body = JSON.parse(req.body.data); // Ensure proper JSON parsing
      }

      return next();
    } catch (error) {
      res.status(400).json({ error: 'Invalid JSON data' });
    }
  },
  ProductsControllers.createProducts
);
  
Productsrouter.get('/', ProductsControllers.getAllProducts);
Productsrouter.get('/:productId', ProductsControllers.getSingleProduct);

Productsrouter.patch('/:productId', auth('ADMIN', 'USER'),
  upload.fields([
    { name: 'bookCover', maxCount: 1 },
  ]),
  (req: Request, res: Response, next: NextFunction): void => {
    console.log('Raw Request Body:', req.body); // Debugging
    console.log('Uploaded Files:', req.files); // Debugging

    if (req.body.data) {
      req.body = JSON.parse(req.body.data); // Ensure proper JSON parsing
    }

    return next();
  }, ProductsControllers.updateProduct);

Productsrouter.delete('/:productId', ProductsControllers.deleteProduct);

export default Productsrouter;
