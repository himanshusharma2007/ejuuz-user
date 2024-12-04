// server.js
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv= require('dotenv')
const authRouter = require('./src/router/authRouter');
const productRouter = require('./src/router/productRouter');
const mongoose = require('mongoose');
dotenv.config();
const connectDB = require('./db/db');  
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);

const uri = process.env.MONGO_URI;

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await connectDB(uri);
  console.log(`Server running on port ${PORT}`);
});
