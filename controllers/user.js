const catchAsync = require("../utils/catchAsync")
const database = require('../sqlconnect');
const config = require('../config');
const { validationResult, check } = require('express-validator');
const jwt = require('jsonwebtoken');
exports.login = catchAsync(async (req, res, next) =>
{
    try
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
                if (rows && rows.length === 1)
                {
                    if (rows[0].permit === 'licensee')
                        connection.query('SELECT * FROM territory WHERE `licensee-id` = ?', [rows[0].id], (error, rows2) =>
                        {
                            if (rows2.length)
                            {
                                const user = rows[0];

                                // Create a JWT with user data
                                const token = jwt.sign({ user, territory: rows2[0] }, config.jwt_secret);

                                // Return the JWT as a response
                                res.json({ token, user: { ...user, territory: rows2[0] }, });
                            }
                            else
                            {
                                res.status(401).json({ message: 'Territory is not assigned', error: true });

                            }
                        })
                    else if (rows[0].permit === 'staff')
                    {
                        connection.query(
                            'SELECT * FROM staff WHERE `user-id` = ?',
                            [rows[0].id],
                            (error, rows4) =>
                            {
                                if (rows4.length)
                                {
                                    const staffRow = rows4[0];
                                    const territoryId = staffRow['territory-id'];
                                    connection.query(
                                        'SELECT * FROM territory WHERE id = ?',
                                        [territoryId],
                                        (error, rows5) =>
                                        {
                                            if (rows5.length)
                                            {
                                                const territory = rows5[0];
                                                const user = rows[0];
                                                const token = jwt.sign(
                                                    { user, territory },
                                                    config.jwt_secret
                                                );
                                                res.json({ token, user: { ...user, territory: territory } });
                                            }
                                            else
                                            {
                                                res.status(401).json({ message: 'Territory is not assigned', error: true });

                                            }
                                        }
                                    );
                                }
                                else
                                {
                                    res.status(401).json({ message: 'Staff collection issue, row not created', error: true });

                                }
                            }
                        );
                    }
                    else
                    {
                        const user = rows[0];

                        // Create a JWT with user data
                        const token = jwt.sign({ user }, config.jwt_secret);

                        // Return the JWT as a response
                        res.json({ token, user });
                    }
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
    } catch (err)
    {
        console.log(err);
    }
})

exports.signup = catchAsync(async (req, res,) =>
{
    try
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

            ], (error, rowz) =>
            {
                const token = jwt.sign({ email, permit }, config.jwt_secret);

                if (permit === "staff")
                {
                    connection.query('INSERT INTO staff (`id`,`territory-id`, `user-id`) VALUES (?,?, ?)', [
                        rowz.insertId,
                        territoryId,
                        rowz.insertId,
                    ])
                }

                res.status(200).json({ token, ...req.body, message: "Signup successfully" });
            })

        })
    } catch (err)
    {
        console.log(err);
    }
})


exports.getAllLicensees = catchAsync(async (req, res, next) =>
{
    try
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
    } catch (err)
    {
        console.log(err);
    }
});

exports.addLicensee = catchAsync(async (req, res, next) =>
{
    try
    {
        const errors = validationResult(req);
        if (!errors.isEmpty())
        {
            return res.status(400).json({ errors: errors.array() });
        }

        const { permit, name_first, name_last, phone, email, pass, notes } = req.body;
        const values = [permit, name_first, name_last, phone, email, pass, notes, req.userData?.user?.id];
        const connection = database.getConnection();

        // Check if email already exists
        const checkEmailQuery = 'SELECT COUNT(*) AS count FROM user WHERE email = ?';
        connection.query(checkEmailQuery, email, (error, results) =>
        {
            if (error)
            {
                console.error('Error checking email:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            const emailCount = results[0].count;
            if (emailCount > 0)
            {
                return res.status(400).json({ error: 'Email already exists' });
            }

            // Email is unique, insert data into user table
            const insertQuery = 'INSERT INTO user (`permit`, `name-first`, `name-last`, `phone`, `email`, `pass`, `notes`, `edit-id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            connection.query(insertQuery, values, (error, results) =>
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
    } catch (err)
    {
        console.log(err);
    }
});


exports.updateLicensee = catchAsync(async (req, res, next) =>
{
    try
    {
        const errors = validationResult(req);
        if (!errors.isEmpty())
        {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.params.id;
        const { permit, name_first, name_last, phone, email, pass, notes, } = req.body;
        const values = [name_first, name_last, phone, email, pass, notes, req.userData?.user?.id, userId, permit];
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
    }
    catch (err)
    {
        console.log(err);
    }
});

exports.deleteLicensee = catchAsync(async (req, res, next) =>
{
    try
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
    } catch (err)
    {
        console.log(err);
    }
});


exports.getUserLicenseeId = catchAsync(async (req, res) =>
{
    try
    {
        const userId = req.params.id;

        try
        {
            const connection = database.getConnection();
            const sql = `
        SELECT *
        FROM user
        WHERE id = ?
      `;

            connection.query(sql, [userId], (error, results) =>
            {
                if (error)
                {
                    console.error('Error retrieving user licensee data:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                if (results.length === 0)
                {
                    return res.status(404).json({ error: 'User not found' });
                }

                return res.status(200).json(results[0]);
            });
        } catch (error)
        {
            console.error('Error connecting to the database:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    } catch (err)
    {
        console.log(err);
    }
});