const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { verifyTheToken } = require('../middlewares/Auth');

const {
    getAllBlogs,
    addBlog,
    updateBlog,
    deleteBlog,
    getBlogById,
} = require('../controllers/blogs');

// Get all blogs
router.get('/',
verifyTheToken,
getAllBlogs);

// Add a new blog
router.post(
    '/add',
    verifyTheToken,
    [
        // Validation rules using express-validator
        check('category').notEmpty(),
        check('subcategory').notEmpty(),
        check('author').notEmpty(),
        check('title').notEmpty(),
        check('blog_text').notEmpty(),
    ],
    addBlog
);
console.log("darshsn")
// Update a blog
router.put(
    '/update/:id',
    verifyTheToken,
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
router.delete('/delete/:id', verifyTheToken,deleteBlog);

// Get a blog by ID
router.get('/:id', getBlogById);

module.exports = router;
