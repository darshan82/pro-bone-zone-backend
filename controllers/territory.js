const catchAsync = require("../utils/catchAsync")
const database = require('../sqlconnect');
const { validationResult } = require("express-validator");

exports.territory = catchAsync(async (req, res, next) =>
{
    const connection = database.getConnection();

    connection.query('SELECT * FROM territory', (error, results) =>
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
})


exports.addTerritory = catchAsync(async (req, res, next) =>
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }
    const { licenseeId, state, county, defaultUrl, notes, editId } = req.body;
    const values = [licenseeId, state, county, defaultUrl, notes, editId];
    const connection = database.getConnection();
    const sql = 'INSERT INTO territory (`licensee-id`, `state`, `county`, `default-url`,`notes`, `edit-id`) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, values, (error, results) => {
        if (error) {
          console.error('Error inserting data into territory table:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
        
        // Return success response
        return res.status(200).json({ message: 'Data inserted successfully' });
      });

})