const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer_email: { type: String, required: true },
  name: { type: String },
  phone: { type: String },
  address: { type: String },
  payment_type: { type: String, enum: ['cod', 'online'], default: 'cod' },
  payment_status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  order_status: {
    type: String,
    enum: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  },
  order_number: { type: String, unique: true },
  items: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  subtotal: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
