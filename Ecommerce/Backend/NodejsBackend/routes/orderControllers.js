const Order = require('../models/orderModel');
const Product = require('../models/ProductModel');

// Utility to generate order number like ORD-000001
let orderCounter = 0;
const generateOrderNumber = async () => {
  orderCounter += 1;
  const padded = orderCounter.toString().padStart(6, '0');
  return `ORD-${padded}`;
};

exports.getOrders = async (req, res) => {
  const limit = parseInt(req.query.limit || '20');
  const skip = parseInt(req.query.skip || '0');
  const orders = await Order.find().skip(skip).limit(limit);
  res.json(orders);
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
};

exports.createOrder = async (req, res) => {
  const { customer_email, items } = req.body;

  if (!customer_email || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing customer_email or valid items' });
  }

  const finalItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.product_id);
    if (!product) {
      return res.status(404).json({ error: `Product not found: ${item.product_id}` });
    }

    const quantity = item.quantity || 1;
    const price = product.price;
    subtotal += price * quantity;

    finalItems.push({
      product_id: product._id,
      name: product.title,
      price,
      quantity,
      image: product.image || ''
    });
  }

  const total = subtotal; // Apply tax/shipping if needed
  const order_number = await generateOrderNumber();

  const order = new Order({
    customer_email,
    payment_status: 'pending',
    order_status: 'processing',
    order_number,
    items: finalItems,
    subtotal,
    total
  });

  await order.save();
  res.status(201).json({ id: order._id, order_number, message: 'Order placed successfully' });
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}` });
  }

  const order = await Order.findByIdAndUpdate(req.params.id, {
    order_status: status,
    updated_at: new Date()
  });

  if (!order) return res.status(404).json({ error: 'Order not found or not updated' });
  res.json({ message: 'Order status updated successfully' });
};

exports.updatePaymentMethod = async (req, res) => {
  const { payment_method } = req.body;

  if (!['cod', 'online'].includes(payment_method)) {
    return res.status(400).json({ error: "payment_method must be 'cod' or 'online'" });
  }

  const order = await Order.findByIdAndUpdate(req.params.id, {
    payment_type: payment_method,
    updated_at: new Date()
  });

  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ message: `Payment method updated to ${payment_method}` });
};

exports.updateCustomerInfo = async (req, res) => {
  const { name, phone, address } = req.body;
  if (!name || !phone || !address) {
    return res.status(400).json({ error: 'Name, phone, and address are required' });
  }

  const order = await Order.findByIdAndUpdate(req.params.id, {
    name,
    phone,
    address,
    updated_at: new Date()
  });

  if (!order) return res.status(404).json({ error: 'Order not found or not updated' });
  res.json({ message: 'Customer info updated successfully' });
};


exports.updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { payment_status, session_id } = req.body;

  try {
    // Validate payment status
    const validStatuses = ['pending', 'paid'];
    if (!validStatuses.includes(payment_status)) {
      return res.status(400).json({
        error: 'Invalid payment status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    // Update the order's payment status in your database
  const order = await Order.findByIdAndUpdate(id, {
    payment_status,
    updated_at: new Date()
  });
    res.json({
      message: 'Payment status updated successfully',
    });

  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
};