const express = require('express');
const mongoose = require('mongoose');
const Category = require('../models/categoryModel');
const Product = require('../models/ProductModel');

const router = express.Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/categories/:id
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/categories
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    data.created_at = new Date();
    data.updated_at = new Date();

    const category = new Category(data);
    await category.save();

    res.status(201).json({ id: category._id, message: 'Category created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/categories/:id
router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    data.updated_at = new Date();

    const result = await Category.findByIdAndUpdate(req.params.id, data, { new: true });

    if (!result) return res.status(404).json({ error: 'Category not found or could not be updated' });

    res.json({ message: 'Category updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req, res) => {
  try {
    // Check if any products use this category
    const count = await Product.countDocuments({ category_id: req.params.id });
    if (count > 0) {
      return res.status(400).json({ error: 'Cannot delete category with associated products' });
    }

    const result = await Category.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Category not found' });

    res.json({ message: 'Category successfully deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
