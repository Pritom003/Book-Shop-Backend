import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import Booksrouter from './app/Books/Books.routers';
// import Booksrouter from './app/Bookss/Bookss.routers';

const app: Application = express();

// Middleware to parse JSON and handle CORS
app.use(express.json());
app.use(cors());
// app Routes
app.use('/api/v1/products', Booksrouter);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Express app!');
});

// 404 error handler for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).send('Route not found');
});

export default app;




