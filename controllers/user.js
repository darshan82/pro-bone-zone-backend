const catchAsync = require("../utils/catchAsync")
const database = require('../sqlconnect');
const config = require('../config');
const { validationResult, check } = require('express-validator');
const jwt = require('jsonwebtoken');
exports.login = catchAsync(async (req, res, next) =>
{
    const errors = validationResult(req);

    console.log("errors", errors)
    if (!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    const connection = database.getConnection();

    const { email, password, permit } = req.body;

    try
    {
        connection.query('SELECT * FROM user WHERE email = ? AND pass = ?', [email, password], (error, rows) =>
        {
            // Query the database to check if user exists

            // Check if a matching user is found
            if (rows.length === 1)
            {
                const user = rows[0];

                // Create a JWT with user data
                const token = jwt.sign({ email: user.email, permit: user.permit }, config.jwt_secret);

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
        res.status(500).json({ message: 'Internal server error' });
    }

})

exports.signup = catchAsync(async (req, res, next) =>
{
    const connection = database.getConnection();

    const { permit,
        nameFirst,
        nameLast,
        phone,
        email,
        pass,
        notes
    } = req.body;
    // Query the database to check if the user already exists
    connection.query('SELECT * FROM user WHERE email = ?', [email], (error, rows) =>
    {
        // Check if the user already exists
        if (rows.length > 0)
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
            console.log("error", error)
            console.log("rows", rows)

            const token = jwt.sign({ email, permit }, config.jwt_secret);
            res.status(200).json({ token, ...req.body, message: "Signup successfully" });
        })

    })
})
