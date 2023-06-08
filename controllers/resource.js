const { validationResult } = require('express-validator');
const database = require('../sqlconnect');

exports.addResource = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { category, title, viewers, type, filepath, status, editId } = req.body;
  const values = [category, title, viewers, type, filepath, status, editId];

  const connection = database.getConnection();
  const sql = 'INSERT INTO resource (`category`, `title`, `viewers`, `type`, `filepath`, `status`, `edit-id`) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error('Error inserting data into resource table:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Return success response
    return res.status(200).json({ message: 'Data inserted successfully' });
  });
};
