import cors from 'cors';
import express, { Application, Request, Response } from 'express';

const app: Application = express();

// Middleware to parse JSON and handle CORS
app.use(express.json());
app.use(cors());
// app Routes

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Express app!');
});

// 404 error handler for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).send('Route not found');
});

export default app;
