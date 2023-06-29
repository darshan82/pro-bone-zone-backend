const catchAsync = require("../utils/catchAsync")
const database = require('../sqlconnect');
const { validationResult } = require("express-validator");

exports.territory = catchAsync(async (req, res, next) =>
{
    try
    {
        const connection = database.getConnection();

        const query = `
      SELECT user.*, territory.*
      FROM territory
      INNER JOIN user ON territory.\`licensee-id\` = user.id
    `;

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
    }
    catch (error)
    {
        console.error('Error executing query:', error);
    }
});



exports.addTerritory = catchAsync(async (req, res, next) =>
{
    try
    {

        const errors = validationResult(req);
        if (!errors.isEmpty())
        {
            return res.status(400).json({ errors: errors.array() });
        }
        const { licenseeId, state, county, defaultUrl, notes, } = req.body;
        const values = [licenseeId, state, county, defaultUrl, notes, req.userData?.user?.id, "USA"];
        const connection = database.getConnection();
        const sql = 'INSERT INTO territory (`licensee-id`, `state`, `county`, `default-url`,`notes`, `edit-id`,`country`) VALUES (?, ?, ?, ?, ?, ?,?)';
        connection.query(sql, values, (error, results) =>
        {
            if (error)
            {
                console.error('Error inserting data into territory table:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Return success response
            return res.status(200).json({ message: 'Data inserted successfully' });
        });
    }
    catch (err)
    {
        console.log('Error inserting', err);
    }
})


exports.updateTerritory = catchAsync(async (req, res, next) =>
{
    try
    {
        const errors = validationResult(req);
        if (!errors.isEmpty())
        {
            return res.status(400).json({ errors: errors.array() });
        }
        const territoryId = req.params.id;
        const { licenseeId, state, county, defaultUrl, notes, editId } = req.body;
        const values = [licenseeId, state, county, defaultUrl, notes, req.userData?.user?.id, territoryId];
        const connection = database.getConnection();
        const sql = 'UPDATE territory SET `licensee-id` = ?, `state` = ?, `county` = ?, `default-url` = ?, `notes` = ?, `edit-id` = ? WHERE `id` = ?';
        connection.query(sql, values, (error, results) =>
        {

            if (error)
            {
                console.error('Error updating territory:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Check if any rows were affected by the update
            if (results.affectedRows === 0)
            {
                return res.status(404).json({ error: 'Territory not found' });
            }

            // Return success response
            return res.status(200).json({ message: 'Territory updated successfully' });
        });
    }
    catch (err)
    {
        console.log(err);
    }
});


exports.deleteTerritory = catchAsync(async (req, res, next) =>
{
    try
    {
        const territoryId = req.params.id;
        const connection = database.getConnection();
        const sql = 'DELETE FROM territory WHERE `id` = ?';
        connection.query(sql, territoryId, (error, results) =>
        {
            if (error)
            {
                console.error('Error deleting territory:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Check if any rows were affected by the delete
            if (results.affectedRows === 0)
            {
                return res.status(404).json({ error: 'Territory not found' });
            }

            // Return success response
            return res.status(200).json({ message: 'Territory deleted successfully' });
        });
    }
    catch (err)
    {
        console.log(err);
    }
});





exports.getTerritoryById = catchAsync(async (req, res, next) =>
{
    try
    {
        const territoryId = req.params.id;
        const connection = database.getConnection();
        const sql = 'SELECT u.*,t.* FROM territory t JOIN user u ON t.`licensee-id` = u.id WHERE t.id = ?';
        connection.query(sql, territoryId, (error, results) =>
        {
            if (error)
            {
                console.error('Error executing query:', error);
                return res.status(500).json({ error: 'Error executing query' });
            }

            if (results.length === 0)
            {
                return res.status(404).json({ error: 'Territory not found' });
            }

            // Return the territory with licensee information
            const territory = results[0];
            console.log(territory)
            res.json(territory);
        });
    }
    catch (err)
    {
        console.log(err);
    }
});



exports.query = (req, res) =>
{
    const connection = database.getConnection();

    const query = "ALTER TABLE event ADD COLUMN state varchar(50) DEFAULT NULL AFTER street3;";

    connection.query(query, (error, result) =>
    {
        if (error)
        {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Error executing query:', error });
            return;
        }

        // Query executed successfully
        res.json({ message: 'Promotion table altered successfully' });
    });
}