import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Modules from src
import connectDB from './src/config/database.js';
import authRoutes from './src/routes/auth.js';
import cartRoutes from './src/routes/cart.js';
import devRoutes from './src/routes/dev.js';
import orderRoutes from './src/routes/orders.js';
import paymentRoutes from './src/routes/payments.js';
import productRoutes from './src/routes/products.js';
import userRoutes from './src/routes/users.js';

import { notFound } from './src/middleware/notFound.js';
import { errorHandler } from './src/middleware/errorHandler.js';

const app = express();

// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// DB connect (ensure it uses process.env.MONGODB_URI)
connectDB();

// mount routes under /api
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/dev', devRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// health check
app.get('/api/health', (_, res) => res.json({ ok: true }));

// error handlers
app.use(notFound);
app.use(errorHandler);

// export the express app (no app.listen here)
export default app;