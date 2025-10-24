const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// your existing modules
const connectDB = require('./config/database'); // adjust path if needed
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const devRoutes = require('./routes/dev');       // you have routes/dev.js
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');

const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// middlewares
app.use(cors());                // tighten origins later to your domains
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
module.exports = app;