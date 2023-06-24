const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
    getAllBlogs,
    addBlog,
    updateBlog,
    deleteBlog,
    getBlogById,
} = require('../controllers/blogs');

// Get all blogs
router.get('/', getAllBlogs);

// Add a new blog
router.post(
    '/add',
    [
        // Validation rules using express-validator
        check('category').notEmpty(),
        check('subcategory').notEmpty(),
        check('author').notEmpty(),
        check('title').notEmpty(),
        check('blog_text').notEmpty(),
        check('edit_id').isInt().notEmpty(),
    ],
    addBlog
);

// Update a blog
router.put(
    '/update/:id',
    [
        // Validation rules using express-validator
        check('category').notEmpty(),
        check('subcategory').notEmpty(),
        check('author').notEmpty(),
        check('title').notEmpty(),
        check('blog_text').notEmpty(),
    ],
    updateBlog
);

// Delete a blog
router.delete('/delete/:id', deleteBlog);

// Get a blog by ID
router.get('/:id', getBlogById);

module.exports = router;
