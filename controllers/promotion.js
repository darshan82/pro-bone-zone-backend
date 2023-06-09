
const { validationResult } = require('express-validator');
const database = require('../sqlconnect');
const catchAsync = require("../utils/catchAsync");


exports.addPromotion = catchAsync(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const {
      territoryId,
      pType,
      pUrl,
      event1Id,
      event2Id,
      event3Id,
      event4Id,
      attendees,
      editId
    } = req.body;
  
    const values = [
      territoryId,
      pType,
      pUrl,
      event1Id,
      event2Id,
      event3Id,
      event4Id,
      attendees,
      editId
    ];
  
    const connection = database.getConnection();
    const sql =
      'INSERT INTO promotion (`territory-id`, `ptype`, `p-url`, `event1-id`, `event2-id`, `event3-id`, `event4-id`, `attendees`, `edit-id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
    connection.query(sql, values, (error, results) => {
      if (error) {
        console.error('Error inserting data into promotion table:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      // Return success response
      return res.status(200).json({ message: 'Data inserted successfully' });
    });
  });
  