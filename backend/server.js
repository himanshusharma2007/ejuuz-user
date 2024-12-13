// server.js
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv= require('dotenv')
const authRouter = require('./src/router/authRouter');
const productRouter = require('./src/router/productRouter');
const shopRouter = require('./src/router/shopRouter');
const cartRouter = require('./src/router/cartRouter');
const wishlistRouter = require('./src/router/wishlistRouter');
const orderRouter = require('./src/router/orderRouter');
const profileRouter = require('./src/router/profileRouter');
const mongoose = require('mongoose');
const cors = require('cors');
dotenv.config();
const connectDB = require('./db/db');  
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Your frontend URL
    credentials: true, // Important for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/shop', shopRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/order', orderRouter);
app.use('/api/profile', profileRouter);

const uri = process.env.MONGO_URI;

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await connectDB(uri);
  console.log(`Server running on port ${PORT}`);
});
