import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import Productsrouter from './app/Books/Products.routers';
import Orderrouter from './app/Orders/Orders.routes';
const app: Application = express();

// Middleware to parse JSON and handle CORS
app.use(express.json());
app.use(cors());
// app Routes
app.use('/api/products', Productsrouter);
app.use('/api/orders', Orderrouter);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Express app!');
});

// 404 error handler for undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: {
      statusCode: 404,
      path: req.originalUrl,
    },
  });
  next()
});

export default app;




