const mongoose = require('mongoose');

const connectDB = async () => {
  try {
mongoose.connect('mongodb+srv://zainkazmi258:Hallian786@cluster0.eqrkuhd.mongodb.net/studentDB')
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
