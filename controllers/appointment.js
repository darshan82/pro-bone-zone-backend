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

    const { eventId, customerId, timeslot, interest, companyId, consultant, rating, feedback, advance, editId } = req.body;
    const values = [eventId, customerId, timeslot, interest, companyId, consultant, rating, feedback, advance, editId];
    const connection = database.getConnection();
    const sql = 'INSERT INTO appointment (`event-id`, `customer-id`, `timeslot`, `interest`, `company-id`, `consultant`, `rating`, `feedback`, `advance`, `edit-id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, values, (error, results) =>
    {
        if (error)
        {
            console.error('Error inserting data into appointment table:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Return success response
        return res.status(200).json({ message: 'Data inserted successfully' });
    });
});
exports.updateAppointment = catchAsync(async (req, res, next) =>
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    const appointmentId = req.query.id;
    const { eventId, customerId, timeslot, interest, companyId, consultant, rating, feedback, advance, editId } = req.body;
    const values = [eventId, customerId, timeslot, interest, companyId, consultant, rating, feedback, advance, editId, appointmentId];
    const connection = database.getConnection();
    const sql = 'UPDATE appointment SET `event-id` = ?, `customer-id` = ?, `timeslot` = ?, `interest` = ?, `company-id` = ?, `consultant` = ?, `rating` = ?, `feedback` = ?, `advance` = ?, `edit-id` = ? WHERE `id` = ?';
    connection.query(sql, values, (error, results) =>
    {
        if (error)
        {
            console.error('Error updating data in appointment table:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Return success response
        return res.status(200).json({ message: 'Data updated successfully' });
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
exports.getAllAppointments = catchAsync(async (req, res, next) =>
{
    const connection = database.getConnection();
    const sql = 'SELECT * FROM appointment';
    connection.query(sql, (error, results) =>
    {
        if (error)
        {
            console.error('Error retrieving data from appointment table:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Return the retrieved appointments
        return res.status(200).json({ appointments: results });
    });
});
