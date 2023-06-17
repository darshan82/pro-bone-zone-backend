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

exports.getAppointmentsByEventId = async (req, res) =>
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    const { eventId } = req.query;

    try
    {
        const connection = database.getConnection();

        const sql = `
        SELECT a.*, e.*, c.*, GROUP_CONCAT(av.timeslot) AS timeslots
        FROM appointment AS a
        INNER JOIN event AS e ON a.\`event-id\` = e.id
        INNER JOIN customer AS c ON a.\`customer-id\` = c.id
        INNER JOIN availability AS av ON e.id = av.event_id
        WHERE a.\`event-id\` = ?
        GROUP BY a.id
      `;

        connection.query(sql, [eventId], (error, results) =>
        {
            if (error)
            {
                console.error('Error retrieving data:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Transform the results to include timeslots as an array in each appointment
            const appointments = results.map((result) =>
            {
                const { timeslots, ...appointmentData } = result;
                const timeslotArray = timeslots.split(',');
                return { ...appointmentData, timeslots: timeslotArray };
            });

            return res.status(200).json({ appointments });
        });
    } catch (error)
    {
        console.error('Error connecting to the database:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



// Define the API endpoint for updating the appointment
exports.updateAppointement = async (req, res) =>
{
    const appointmentId = req.params.id;
    const customerId = req.params.customerId;

    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const {
        firstName,
        lastName,
        interest,
        timeslot,
        consultant,
        companyId,
        status,
        advance,
        rating,
        feedback,
        notes
    } = req.body;
    const connection = database.getConnection();

    // Update appointment table
    connection.query(
        'UPDATE appointment SET `timeslot` = ?, interest = ?, `company-id` = ?, consultant = ?, advance = ? , rating = ?, feedback = ? WHERE `id` = ?',
        [timeslot, interest, companyId, consultant, advance, rating, feedback, appointmentId],
        (error) =>
        {
            if (error)
            {
                console.error('Error updating appointment:', error);
                res.status(500).json({ error: 'Error updating appointment' });
                return;
            }

            // Update customer table
            connection.query(
                'UPDATE customer SET `name-first` = ?, `name-last` = ?, notes = ? WHERE `id` = ?',
                [firstName, lastName, notes, customerId],
                (error) =>
                {
                    if (error)
                    {
                        console.error('Error updating customer:', error);
                        res.status(500).json({ error: 'Error updating customer' });
                        return;
                    }
                    res.status(200).json({ error: false });
                }
            );
        }
    );
}


