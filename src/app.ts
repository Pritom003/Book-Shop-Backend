import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import Productsrouter from './app/Books/Products.routers';
import Orderrouter from './app/Orders/Orders.routes';
import Authrouter from './app/Auth/Auth.route'
import ReviewRoute from './app/Review/Review.routeer'
import { userRoutes } from './app/User/user.router';
import globalErrorhandler from './app/Middleware/globalErrorhandler';
const app: Application = express();

// Middleware to parse JSON and handle CORS
app.use(express.json());
const allowedOrigins = ['http://localhost:5173']; // Add frontend origin

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow credentials (cookies, authorization headers)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
// app Routes
app.use('/api/products', Productsrouter);
app.use('/api/order', Orderrouter);
app.use('/api/auth',Authrouter)
app.use('/api/',userRoutes)
app.use('/api/review',ReviewRoute)

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Express app!');
});
app.use(globalErrorhandler);
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
  next();
});

export default app;
