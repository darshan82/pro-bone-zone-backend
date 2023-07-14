const catchAsync = require("../utils/catchAsync")
const database = require('../sqlconnect');

exports.event = catchAsync(async (req, res, next) =>
{
    const connection = database.getConnection();

    let query = 'SELECT * FROM event';
    const territoryId = req?.userData?.territory?.id ?? null
    if (territoryId)
    {
        query += ` WHERE territory_id = ${territoryId}`;
    }

    connection.query(query, (error, results) =>
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
    console.log("eventId", eventId)
    const { etype, edate, capacity, time_start, time_end, city, street1, street2, street3 } = req.body;

    const connection = database.getConnection();
    const sql = 'UPDATE event SET etype = ?, edate = ?, capacity = ?, `time-start` = ?, `time-end` = ?, city = ?, street1 = ?, street2 = ?, street3 = ?, edit_id = ? WHERE id = ?';

    const values = [etype, edate, capacity, time_start, time_end, city, street1, street2, street3, req.userData?.user?.id, eventId];

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

const timeList = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM",
    "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM",
    "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM",
    "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM"
];

exports.addEvent = catchAsync(async (req, res) =>
{
    const { state, territory_id, etype, edate, capacity, time_start, time_end, city, street1, street2, street3 } = req.body;

    const connection = database.getConnection();
    const sql = 'INSERT INTO event (state, territory_id, etype, edate, capacity, `time-start`, `time-end`, city, street1, street2, street3, edit_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const values = [state, territory_id, etype, edate, capacity, time_start, time_end, city, street1, street2, street3, req.userData?.user?.id];

    connection.query(sql, values, (error, results) =>
    {
        if (error)
        {
            console.error('Error inserting data into event table:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const eventId = results.insertId; // Get the auto-incremented id of the inserted event

        const filterTimeRange = (arr, startTime, endTime) =>
        {
            let isWithinRange = false;
            return arr.filter(time =>
            {
                if (time === startTime)
                {
                    isWithinRange = true;
                }
                if (isWithinRange)
                {
                    if (time === endTime)
                    {
                        isWithinRange = false;
                    }
                    return true;
                }
                return false;
            });
        };
        const filteredTimeList = filterTimeRange(timeList, time_start, time_end);
        let availabilityValues
        if (filteredTimeList.length == 1 || filteredTimeList.length === 0)
            availabilityValues = filteredTimeList.map(timeslot => [eventId, timeslot, capacity])
        else
        {
            filteredTimeList.pop()
            availabilityValues = filteredTimeList.map(timeslot => [eventId, timeslot, capacity]) }


        const availabilitySql = 'INSERT INTO availability (event_id, timeslot, seats) VALUES ?';


        connection.query(availabilitySql, [availabilityValues], (availabilityError) =>
        {
            if (availabilityError)
            {
                console.error('Error inserting data into availability table:', availabilityError);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Return success response
            return res.status(200).json({ message: 'Event added successfully' });
        });
    });
});

exports.getEventById = catchAsync(async (req, res, next) =>
{
    const eventId = req.params.id;
    const connection = database.getConnection();

    const query = 'SELECT * FROM event WHERE id = ?';
    connection.query(query, [eventId], (error, results) =>
    {
        if (error)
        {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Error executing query:', error });
        }

        // Check if any rows were returned
        if (results.length === 0)
        {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Return the event
        res.json(results[0]);
    });
});
