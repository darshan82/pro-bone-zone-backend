const catchAsync = require("../utils/catchAsync")
const database = require('../sqlconnect');
const { validationResult } = require("express-validator");

exports.event = catchAsync(async (req, res, next) =>
{
    const connection = database.getConnection();

    connection.query('SELECT * FROM event', (error, results) =>
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
