const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  brand: String,
  description: String,
  price: Number,
  image: String,
  category_id: mongoose.Schema.Types.ObjectId,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

productSchema.index({ name: 'text', description: 'text' }); // for $text search

module.exports = mongoose.model('Product', productSchema);
