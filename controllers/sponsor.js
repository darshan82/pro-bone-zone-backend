const { validationResult } = require('express-validator');
const database = require('../sqlconnect');

exports.addSponsor = (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract data from request body
  const {
    territoryId,
    scategory,
    stype,
    organizationName,
    webpage,
    logo,
    description,
    contactName,
    email,
    phone,
    notes,
    editId,
  } = req.body;

  // Prepare the SQL query and parameter values
  const sql = 'INSERT INTO sponsor (`territory_id`, `scategory`, `stype`, `organization-name`, `webpage`, `logo`, `description`, `contact-name`, `email`, `phone`, `notes`, `updated`, `edit-id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [
    territoryId,
    scategory,
    stype,
    organizationName,
    webpage,
    logo,
    description,
    contactName,
    email,
    phone,
    notes,
    new Date(),
    editId,
  ];

  // Execute the query
  const connection = database.getConnection(); // Assuming you have a method to get the database connection
  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error('Error inserting data into sponsor table:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Return success response
    return res.status(200).json({ message: 'Data inserted successfully' });
  });
};
