const { validationResult } = require('express-validator');
const mysql = require('mysql');
const database = require('../sqlconnect');

// Get all blogs
exports.getAllBlogs = (req, res) =>
{
    const connection = database.getConnection();
    const query = 'SELECT * FROM blogs';
    connection.query(query, (error, results) =>
    {
        if (error)
        {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Error executing query:', error });
            return;
        }
        res.json(results);
    });
};

// Add a new blog
exports.addBlog = (req, res) =>
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }
    const { category, subcategory, author, title, blog_text, status } = req.body;
    const values = [category, subcategory, author, title, blog_text, req.userData?.user?.id, status];
    const connection = database.getConnection();
    const sql =
        'INSERT INTO blogs (category, subcategory, author, title, blog_text, edit_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, values, (error, results) =>
    {
        if (error)
        {
            console.error('Error inserting data into blogs table:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.status(200).json({ message: 'Data inserted successfully' });
    });
};

// Update a blog
exports.updateBlog = (req, res) =>
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    const blogId = req.params.id;
    const { category, subcategory, author, title, blog_text, status } = req.body;
    const values = [category, subcategory, author, title, blog_text, req.userData?.user?.id, status, blogId];
    const connection = database.getConnection();
    const sql =
        'UPDATE blogs SET category = ?, subcategory = ?, author = ?, title = ?, blog_text = ?, edit_id = ?, status = ? WHERE id = ?';
    connection.query(sql, values, (error, results) =>
    {
        if (error)
        {
            console.error('Error updating blog:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.affectedRows === 0)
        {
            return res.status(404).json({ error: 'Blog not found' });
        }

        return res.status(200).json({ message: 'Blog updated successfully' });
    });
};

// Delete a blog
exports.deleteBlog = (req, res) =>
{
    const blogId = req.params.id;
    const connection = database.getConnection();
    const sql = 'DELETE FROM blogs WHERE id = ?';
    connection.query(sql, blogId, (error, results) =>
    {
        if (error)
        {
            console.error('Error deleting blog:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.affectedRows === 0)
        {
            return res.status(404).json({ error: 'Blog not found' });
        }

        return res.status(200).json({ message: 'Blog deleted successfully' });
    });
};

// Get a blog by ID
exports.getBlogById = (req, res) =>
{
    const blogId = req.params.id;
    const connection = database.getConnection();
    const sql = 'SELECT * FROM blogs WHERE id = ?';
    connection.query(sql, blogId, (error, results) =>
    {
        if (error)
        {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Error executing query' });
        }

        if (results.length === 0)
        {
            return res.status(404).json({ error: 'Blog not found' });
        }

        // Return the blog
        const blog = results[0];
        res.json(blog);
    });
};
