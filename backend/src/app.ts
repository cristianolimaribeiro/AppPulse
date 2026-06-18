import express from 'express';
import cors from 'cors';
import { routes } from './routes';
import { errorMiddleware } from './middlewares/errorMiddleware';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Routes
app.use('/api', routes);

// Centralized error handling
app.use(errorMiddleware);

export { app };