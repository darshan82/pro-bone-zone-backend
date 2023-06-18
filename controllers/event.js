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


exports.deleteEvent = catchAsync(async (req, res) =>
{
    const eventId = req.params.id;

    const connection = database.getConnection();
    const sql = 'DELETE FROM event WHERE id = ?';

    connection.query(sql, [eventId], (error, results) =>
    {
        if (error)
        {
            console.error('Error deleting event:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Check if any rows were affected by the delete
        if (results.affectedRows === 0)
        {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Return success response
        return res.status(200).json({ message: 'Event deleted successfully' });
    });
});

// Update an event
exports.updateEvent = catchAsync(async (req, res) =>
{
    const eventId = req.params.id;
    const { territory_id, etype, edate, capacity, time_start, time_end, city, street1, street2, street3, attendees, edit_id } = req.body;

    const connection = database.getConnection();
    const sql = 'UPDATE event SET territory_id = ?, etype = ?, edate = ?, capacity = ?, `time-start` = ?, `time-end` = ?, city = ?, street1 = ?, street2 = ?, street3 = ?, attendees = ?, edit_id = ? WHERE id = ?';

    const values = [territory_id, etype, edate, capacity, time_start, time_end, city, street1, street2, street3, attendees, edit_id, eventId];

    connection.query(sql, values, (error, results) =>
    {
        if (error)
        {
            console.error('Error updating event:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Check if any rows were affected by the update
        if (results.affectedRows === 0)
        {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Return success response
        return res.status(200).json({ message: 'Event updated successfully' });
    });
});
// Add an event
exports.addEvent = catchAsync(async (req, res) =>
{
    const { territory_id, etype, edate, capacity, time_start, time_end, city, street1, street2, street3, attendees, edit_id } = req.body;

    console.log(req.body)
    const connection = database.getConnection();
    const sql = 'INSERT INTO event (territory_id, etype, edate, capacity, `time-start`, `time-end`, city, street1, street2, street3, attendees, edit_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const values = [territory_id, etype, edate, capacity, time_start, time_end, city, street1, street2, street3, attendees, edit_id];

    connection.query(sql, values, (error, results) =>
    {
        if (error)
        {
            console.error('Error inserting data into event table:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Return success response
        return res.status(200).json({ message: 'Event added successfully' });
    });
});
