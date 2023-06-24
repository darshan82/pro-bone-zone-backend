const catchAsync = require("../utils/catchAsync");
const database = require('../sqlconnect');
const { validationResult } = require("express-validator");


exports.getStaffs = async (req, res) =>
{
    try
    {
        const connection = database.getConnection();
        const sql = `
          SELECT s.id AS staff_id, s.\`territory-id\`, t.country, t.state, t.county, t.\`default-url\`,
            u.id AS user_id, u.permit, u.\`name-first\`, u.\`name-last\`, u.phone, u.email
          FROM staff s
          INNER JOIN territory t ON s.\`territory-id\` = t.id
          INNER JOIN user u ON s.\`user-id\` = u.id
          WHERE u.permit = 'staff'
        `;

        connection.query(sql, (error, results) =>
        {
            if (error)
            {
                console.error('Error retrieving staff data:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            return res.status(200).json(results);
        });
    } catch (error)
    {
        console.error('Error connecting to the database:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

