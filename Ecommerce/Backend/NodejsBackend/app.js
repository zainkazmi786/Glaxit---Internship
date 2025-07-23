const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/config');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
connectDB();
// Import routes
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');

// Register routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/uploads', express.static('uploads'));


// Upload folder setup
const fs = require('fs');
const uploadPath = path.join(__dirname, process.env.UPLOAD_FOLDER);
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
