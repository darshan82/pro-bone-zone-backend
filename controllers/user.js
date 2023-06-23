const catchAsync = require("../utils/catchAsync")
const database = require('../sqlconnect');
const config = require('../config');
const { validationResult, check } = require('express-validator');
const jwt = require('jsonwebtoken');
exports.login = catchAsync(async (req, res, next) =>
{
    const errors = validationResult(req);

    if (!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    const connection = database.getConnection();

    const { email, password, } = req.body;

    try
    {
        connection.query('SELECT * FROM user WHERE email = ? AND pass = ?', [email, password], (error, rows) =>
        {
            // Query the database to check if user exists

            // Check if a matching user is found
            console.log("rows", rows)
            if (rows && rows.length === 1)
            {
                const user = rows[0];

                // Create a JWT with user data
                const token = jwt.sign({ email: user.email, permit: user.permit, id: user.id }, config.jwt_secret);

                // Return the JWT as a response
                res.json({ token, user });
            } else
            {
                res.status(401).json({ message: 'Invalid credentials', error: true });
            }
        });


    } catch (error)
    {
        console.error('Error occurred while logging in:', error);
        res.status(500).json({ message: `Internal server error ${String(error)}` });
    }

})

exports.signup = catchAsync(async (req, res,) =>
{
    const connection = database.getConnection();

    const { permit,
        nameFirst,
        nameLast,
        phone,
        email,
        pass,
        notes,
        territoryId
    } = req.body;
    // Query the database to check if the user already exists
    connection.query('SELECT * FROM user WHERE email = ?', [email], (error, rows) =>
    {
        // Check if the user already exists
        if (rows && rows.length > 0)
        {
            return res.status(400).json({ message: 'User already exists' });
        }

        connection.query('INSERT INTO user (`permit`, `name-first`, `name-last`, `phone`, `email`, `pass`, `edit-id`,`notes`) VALUES (?, ?, ?, ?, ?, ?,?,?)', [
            permit,
            nameFirst,
            nameLast,
            phone,
            email,
            pass,
            0,
            notes || null

        ], (error, rows) =>
        {

            const token = jwt.sign({ email, permit }, config.jwt_secret);

            // if (permit === "staff")
            // {
            //     connection.query('INSERT INTO staff (`territory-id`, `user-id`) VALUES (?, ?)', [
            //         territoryId,
            //         nameFirst,
            //     ])
            // }
            // if (permit === "licensee")
            // {

            // }
            res.status(200).json({ token, ...req.body, message: "Signup successfully" });
        })

    })
})


exports.getAllLicensees = catchAsync(async (req, res, next) =>
{
    const connection = database.getConnection();

    connection.query('SELECT * FROM user WHERE `permit` = ?', ['licensee'], (error, results) =>
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

exports.addLicensee = catchAsync(async (req, res, next) =>
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }
    const { permit, name_first, name_last, phone, email, pass, notes, edit_id } = req.body;
    const values = [permit, name_first, name_last, phone, email, pass, notes, edit_id];
    const connection = database.getConnection();
    const sql = 'INSERT INTO user (`permit`, `name-first`, `name-last`, `phone`, `email`, `pass`, `notes`, `edit-id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, values, (error, results) =>
    {
        if (error)
        {
            console.error('Error inserting data into user table:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Return success response
        return res.status(200).json({ message: 'Data inserted successfully' });
    });
});

exports.updateLicensee = catchAsync(async (req, res, next) =>
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.params.id;
    const { permit, name_first, name_last, phone, email, pass, notes, edit_id } = req.body;
    const values = [name_first, name_last, phone, email, pass, notes, edit_id, userId, permit];
    const connection = database.getConnection();
    const sql = 'UPDATE user SET `name-first` = ?, `name-last` = ?, `phone` = ?, `email` = ?, `pass` = ?, `notes` = ?, `edit-id` = ? WHERE `id` = ? AND `permit` = ?';
    connection.query(sql, values, (error, results) =>
    {
        if (error)
        {
            console.error('Error updating licensee:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Check if any rows were affected by the update
        if (results.affectedRows === 0)
        {
            return res.status(400).json({ error: ' Not found' });
        }

        // Return success response
        return res.status(200).json({ message: ' Updated successfully' });
    });
});

exports.deleteLicensee = catchAsync(async (req, res, next) =>
{
    const userId = req.params.id;
    const connection = database.getConnection();
    const sql = 'DELETE FROM user WHERE `id` = ?';
    connection.query(sql, [userId], (error, results) =>
    {
        if (error)
        {
            console.error('Error deleting licensee:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Check if any rows were affected by the delete
        if (results.affectedRows === 0)
        {
            return res.status(404).json({ error: 'Licensee not found' });
        }

        // Return success response
        return res.status(200).json({ message: 'Licensee deleted successfully' });
    });
});


exports.getUserLicenseeId = catchAsync(async (req, res) => {
    const userId = req.params.id;
  
    try {
      const connection = database.getConnection();
      const sql = `
        SELECT *
        FROM user
        WHERE id = ?
      `;
  
      connection.query(sql, [userId], (error, results) => {
        if (error) {
          console.error('Error retrieving user licensee data:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        return res.status(200).json(results[0]);
      });
    } catch (error) {
      console.error('Error connecting to the database:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });