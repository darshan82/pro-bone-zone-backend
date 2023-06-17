const catchAsync = require("../utils/catchAsync");
const database = require('../sqlconnect');
const { validationResult } = require("express-validator");

exports.addAppointments = catchAsync(async (req, res, next) =>
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        date,
        firstName,
        lastName,
        email,
        phone,
        type,
        time,
        description,
        promotionId,
        eventId,
        // Add any other necessary fields here
    } = req.body;

    const connection = database.getConnection();

    // Step 1: Insert data into the customer table
    const customerValues = [firstName, lastName, email, phone, 100, description];
    const customerSql =
        'INSERT INTO customer (`name-first`, `name-last`, `email`, `phone`,`territory_id`,`notes`) VALUES (?, ?, ?, ?,?,?)';

    connection.query(customerSql, customerValues, (error, customerResult) =>
    {
        if (error)
        {
            console.error('Error inserting data into customer table:', error);
            return res.status(500).json({ error: 'Internal server error' + error });
        }

        const customerId = customerResult.insertId;

        // Step 2: Insert data into the appointment table
        const appointmentValues = [eventId, customerId, time];
        const appointmentSql =
            'INSERT INTO appointment (`event-id`, `customer-id`, `timeslot`) VALUES (?, ?, ?)';

        connection.query(appointmentSql, appointmentValues, (error, appointmentResult) =>
        {
            if (error)
            {
                console.error('Error inserting data into appointment table:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Step 3: Update attendees in the promotion table
            const updatePromotionSql = 'UPDATE promotion SET attendees = attendees + 1 WHERE id = ?';
            connection.query(updatePromotionSql, [promotionId], (error) =>
            {
                if (error)
                {
                    console.error('Error updating attendees in the promotion table:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                // Step 4: Update attendees in the event table
                const updateEventSql = 'UPDATE event SET attendees = attendees + 1 WHERE id = ?';
                connection.query(updateEventSql, [eventId], (error) =>
                {
                    if (error)
                    {
                        console.error('Error updating attendees in the event table:', error);
                        return res.status(500).json({ error: 'Internal server error' });
                    }

                    // Return success response
                    return res.status(200).json({ message: 'Data inserted successfully' });
                });
            });
        });
    });
});


exports.deleteAppointment = catchAsync(async (req, res, next) =>
{
    const appointmentId = req.params.id;
    const connection = database.getConnection();
    const sql = 'DELETE FROM appointment WHERE `id` = ?';
    connection.query(sql, [appointmentId], (error, results) =>
    {
        if (error)
        {
            console.error('Error deleting data from appointment table:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Return success response
        return res.status(200).json({ message: 'Data deleted successfully' });
    });
});

exports.getAppointmentsByEventId = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { eventId } = req.query;
  
    try {
      const connection = database.getConnection();
  
      const sql = `
        SELECT a.*, e.*, c.*
        FROM appointment AS a
        INNER JOIN event AS e ON a.\`event-id\` = e.id
        INNER JOIN customer AS c ON a.\`customer-id\` = c.id
        WHERE a.\`event-id\` = ?
      `;
  
      connection.query(sql, [eventId], (error, results) => {
        if (error) {
          console.error('Error retrieving data:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        return res.status(200).json({ appointments: results });
      });
    } catch (error) {
      console.error('Error connecting to the database:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };