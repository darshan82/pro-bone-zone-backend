const { validationResult } = require('express-validator');
const database = require('../sqlconnect');
const catchAsync = require("../utils/catchAsync");

exports.addResource = (req, res) =>
{
  const errors = validationResult(req);
  if (!errors.isEmpty())
  {
    return res.status(400).json({ errors: errors.array() });
  }

  const { category, title, viewers, type, filepath, status } = req.body;
  const values = [category, title, viewers, type, filepath, status, req.userData?.user?.id];

  const connection = database.getConnection();
  const sql = 'INSERT INTO resource (`category`, `title`, `viewers`, `type`, `filepath`, `status`, `edit-id`) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(sql, values, (error, results) =>
  {
    if (error)
    {
      console.error('Error inserting data into resource table:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Return success response
    return res.status(200).json({ message: 'Data inserted successfully' });
  });
};
exports.getAllResources = catchAsync(async (req, res, next) =>
{
  const connection = database.getConnection();

  connection.query('SELECT * FROM resource', (error, results) =>
  {
    if (error)
    {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Error executing query:', error });
      return;
    }

    // Process the query results
    res.json(results);
  });
});
exports.getOneResource = catchAsync(async (req, res, next) => {
  const resourceId = req.params.id;
  const connection = database.getConnection();

  connection.query('SELECT * FROM resource WHERE id = ?', [resourceId], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Error executing query:', error });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    // Process the query result
    res.json(results[0]);
  });
});
exports.updateResource = catchAsync(async (req, res, next) => {
  const resourceId = req.params.id;
  const { category, title, viewers, type, filepath, status, editId } = req.body;
  const connection = database.getConnection();


  const sql = `UPDATE resource SET category = ?, title = ?, viewers = ?, type = ?, filepath = ?, status = ?, \`edit-id\` = ? WHERE id = ?`;
  const values = [category, title, viewers, type, filepath, status, req.userData?.user?.id, resourceId];

  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error('Error updating data in resource table:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Return success response
    res.status(200).json({ message: 'Resource updated successfully' });
  });
});
exports.deleteResource = catchAsync(async (req, res, next) => {
  const resourceId = req.params.id;
  const connection = database.getConnection();

  const sql = 'DELETE FROM resource WHERE id = ?';

  connection.query(sql, [resourceId], (error, results) => {
    if (error) {
      console.error('Error deleting data from resource table:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    // Return success response
    res.status(200).json({ message: 'Resource deleted successfully' });
  });
});
