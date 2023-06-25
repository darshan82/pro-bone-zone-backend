const { validationResult } = require('express-validator');
const database = require('../sqlconnect');
const catchAsync = require('../utils/catchAsync');

exports.addSponsor = (req, res) =>
{
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty())
  {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract data from request body
  const {
    territoryId,
    scategory,
    stype,
    organizationName,
    webpage,
    logo,
    description,
    contactName,
    email,
    phone,
    notes,
  } = req.body;

  // Prepare the SQL query and parameter values
  const sql = 'INSERT INTO sponsor (`territory_id`, `scategory`, `stype`, `organization-name`, `webpage`, `logo`, `description`, `contact-name`, `email`, `phone`, `notes`, `updated`, `edit-id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [
    territoryId,
    scategory,
    stype,
    organizationName,
    webpage,
    logo,
    description,
    contactName,
    email,
    phone,
    notes,
    new Date(),
    req.userData?.user?.id,
  ];

  // Execute the query
  const connection = database.getConnection(); // Assuming you have a method to get the database connection
  connection.query(sql, values, (error, results) =>
  {
    if (error)
    {
      console.error('Error inserting data into sponsor table:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Return success response
    return res.status(200).json({ message: 'Data inserted successfully' });
  });
};


exports.getSponsorsBasedOnTerritoryId = async (req, res) =>
{
  try
  {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
      return res.status(400).json({ errors: errors.array() });
    }

    const territoryId = req.params.territoryId;
    const connection = database.getConnection(); // Assuming you have a method to get the database connection

    // Fetch sponsors based on territory_id
    connection.query(
      'SELECT * FROM sponsor WHERE territory_id = ?',
      [territoryId],
      (error, results) =>
      {
        if (error)
        {
          console.error('Error executing query:', error);
          return res.status(500).json({ error: 'Error executing query' });
        }

        res.json({ sponsors: results });
      }
    );
  } catch (error)
  {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Error executing query' });
  }
};


exports.deleteSponsor = catchAsync(async (req, res, next) =>
{
  const sponsorId = req.params.id;

  const connection = database.getConnection();
  const sql = 'DELETE FROM sponsor WHERE id = ?';
  const values = [sponsorId];

  connection.query(sql, values, (error, results) =>
  {
    if (error)
    {
      console.error('Error deleting sponsor:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Check if any rows were affected by the delete
    if (results.affectedRows === 0)
    {
      return res.status(404).json({ error: 'Sponsor not found' });
    }

    // Return success response
    return res.status(200).json({ message: 'Sponsor deleted successfully' });
  });
});


exports.updateSponsor = catchAsync(async (req, res, next) =>
{
  const sponsorId = req.params.id;
  const {
    scategory,
    stype,
    organizationName,
    webpage,
    logo,
    description,
    contactName,
    email,
    phone,
    notes,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty())
  {
    return res.status(400).json({ errors: errors.array() });
  }

  const connection = database.getConnection();
  const sql =
    'UPDATE sponsor SET `scategory` = ?, `stype` = ?, `organization-name` = ?, `webpage` = ?, `logo` = ?, `description` = ?, `contact-name` = ?, `email` = ?, `phone` = ?, `notes` = ?, `edit-id` = ? WHERE `id` = ?';
  const values = [
    scategory,
    stype,
    organizationName,
    webpage,
    logo,
    description,
    contactName,
    email,
    phone,
    notes,
    req.userData?.user?.id,
    sponsorId
  ];

  connection.query(sql, values, (error, results) =>
  {
    if (error)
    {
      console.error('Error updating sponsor:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Check if any rows were affected by the update
    if (results.affectedRows === 0)
    {
      return res.status(404).json({ error: 'Sponsor not found' });
    }

    // Return success response
    return res.status(200).json({ message: 'Sponsor updated successfully' });
  });
});

exports.getSponsors = catchAsync(async (req, res, next) =>
{
  const connection = database.getConnection();

  const sql =
    'SELECT sponsor.*, territory.country, territory.state, territory.county, territory.\`default-url\` FROM sponsor JOIN territory ON sponsor.territory_id = territory.id';

  connection.query(sql, (error, results) =>
  {
    if (error)
    {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Error executing query' });
    }

    // Process the query results
    const sponsors = results.map((sponsor) => ({
      id: sponsor.id,
      territoryId: sponsor.territory_id,
      scategory: sponsor.scategory,
      stype: sponsor.stype,
      organizationName: sponsor['organization-name'],
      webpage: sponsor.webpage,
      logo: sponsor.logo,
      description: sponsor.description,
      contactName: sponsor['contact-name'],
      email: sponsor.email,
      phone: sponsor.phone,
      notes: sponsor.notes,
      updated: sponsor.updated,
      country: sponsor.country,
      state: sponsor.state,
      county: sponsor.county,
      defaultUrl: sponsor['default-url'],
    }));

    res.json(sponsors);
  });
});



exports.getSponsor = (req, res) =>
{
  const blogId = req.params.id;
  const connection = database.getConnection();
  const sql = 'SELECT * FROM sponsor WHERE id = ?';
  connection.query(sql, blogId, (error, results) =>
  {
    if (error)
    {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Error executing query' });
    }

    if (results.length === 0)
    {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Return the blog
    const blog = results[0];
    res.json(blog);
  });
};