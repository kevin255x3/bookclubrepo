// define api endpoints for category operations
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET /api/categories - get all categories
router.get('/', categoryController.getAllCategories);

// GET /api/categories/:id - get a single category by ID
router.get('/:id', categoryController.getCategoryById);

// POST /api/categories - create a new category
router.post('/', categoryController.createCategory);

// PUT /api/categories/:id - update an existing category
router.put('/:id', categoryController.updateCategory);

// DELETE /api/categories/:id - delete a category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;