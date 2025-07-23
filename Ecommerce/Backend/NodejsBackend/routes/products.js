const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Product = require('../models/ProductModel');
const { allowedFile } = require('../utils/helpers');

const router = express.Router();

// multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', process.env.UPLOAD_FOLDER));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// GET /api/products
router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const skip = parseInt(req.query.skip) || 0;
  const category_id = req.query.category_id;
  const search = req.query.search;

  try {
    let products;

    if (category_id) {
      products = await Product.find({ category_id }).skip(skip).limit(limit);
    } else if (search) {
      products = await Product.find({ $text: { $search: search } }).skip(skip).limit(limit);
    } else {
      products = await Product.find().skip(skip).limit(limit);
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/products/bulk
router.post('/bulk', async (req, res) => {
  const { ids } = req.body;
  if (!ids || !ids.length) return res.json([]);

  try {
    const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
    const products = await Product.find({ _id: { $in: objectIds } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/products
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    console.log("req.body : ", data)
    
    if (req.file && allowedFile(req.file.originalname)) {
    const fullImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    data.image = fullImageUrl;
    }


    if (data.category_id) {
      data.category_id = new mongoose.Types.ObjectId(data.category_id);
    }
    // console.log("data : ", data)
    const product = new Product(data);
    await product.save();

    res.status(201).json({ id: product._id, message: 'Product created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/products/:id
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file && allowedFile(req.file.originalname)) {
    const fullImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    data.image = fullImageUrl;
    }


    if (data.category_id) {
      data.category_id = new mongoose.Types.ObjectId(data.category_id);
    }

    data.updated_at = new Date();

    const result = await Product.findByIdAndUpdate(req.params.id, data, { new: true });

    if (!result) return res.status(404).json({ error: 'Product not found or could not be updated' });

    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Product not found or could not be deleted' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
