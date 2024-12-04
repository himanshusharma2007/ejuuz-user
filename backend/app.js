const express = require('express');
const app = express();
const productRouter = require('./src/router/productRouter');

// ... other middleware
app.use('/api/v1', productRouter);

module.exports = app; 