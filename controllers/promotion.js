
const { validationResult } = require('express-validator');
const database = require('../sqlconnect');
const catchAsync = require("../utils/catchAsync");




exports.getPromotionById = catchAsync(async (req, res, next) =>
{
  try {
    
    const promotionId = req.params.promotionId; // Assuming you pass the promotion ID as a URL parameter
    
  const connection = database.getConnection();
  
  connection.query(
    `SELECT * FROM promotion WHERE id = ${promotionId}`,
    (error, promotionResults) =>
    {
      if (error)
      {
        console.error('Error executing promotion query:', error);
        res.status(500).json({ error: 'Error executing promotion query:', error });
        return;
      }

      const promotionData = promotionResults[0]; // Assuming there is only one promotion with the given ID

      const eventIds = [
        promotionData['event1-id'],
        promotionData['event2-id'],
        promotionData['event3-id'],
        promotionData['event4-id']
      ].filter(Boolean); // Filter out any null/undefined event IDs

      if (eventIds.length === 0)
      {
        // If no event IDs found, return the promotion data without events
        res.json(promotionData);
        return;
      }

      connection.query(
        `SELECT * FROM event WHERE id IN (${eventIds.join(',')})`,
        (error, eventResults) =>
        {
          if (error)
          {
            console.error('Error executing event query:', error);
            res.status(500).json({ error: 'Error executing event query:', error });
            return;
          }
          console.log("eventResults", eventResults)

          const eventIdsWithAvailability = eventResults.map((event) => event.id);
          console.log("eventIdsWithAvailability", eventIdsWithAvailability)
          if (eventIdsWithAvailability && eventIdsWithAvailability.length)
            connection.query(
              `SELECT * FROM availability WHERE event_id IN (${eventIdsWithAvailability.join(
                ','
              )})`,
              (error, availabilityResults) =>
              {
                if (error)
                {
                  console.error('Error executing availability query:', error);
                  res.status(500).json({ error: 'Error executing availability query:', error });
                  return;
                }

                const promotionWithEvents = {
                  ...promotionData,
                  events: eventResults,
                  availability: availabilityResults
                };

                res.json(promotionWithEvents);
              }
            );
          else
          {
            const promotionWithEvents = {
              ...promotionData,
              events: eventResults,
              availability: []
            };

            res.json(promotionWithEvents);
          }
        }
        );
      }
      );
    } catch (error) {
      
    }
    });


exports.getAllPromotions = catchAsync(async (req, res, next) =>
{
  const connection = database.getConnection();

  connection.query('SELECT * FROM promotion', (error, promotionResults) =>
  {
    if (error)
    {
      console.error('Error executing promotion query:', error);
      res.status(500).json({ error: 'Error executing promotion query:', error });
      return;
    }

    if (promotionResults.length === 0)
    {
      // If no promotions found, return an empty array
      res.json([]);
      return;
    }

    const eventIds = promotionResults.reduce((ids, promotion) =>
    {
      return ids.concat(
        [
          promotion['event1-id'],
          promotion['event2-id'],
          promotion['event3-id'],
          promotion['event4-id']
        ].filter(Boolean)
      );
    }, []);

    if (eventIds.length === 0)
    {
      // If no event IDs found, return the promotion data without events
      res.json(promotionResults);
      return;
    }

    connection.query(`SELECT * FROM event WHERE id IN (${eventIds.join(',')})`, (error, eventResults) =>
    {
      if (error)
      {
        console.error('Error executing event query:', error);
        res.status(500).json({ error: 'Error executing event query:', error });
        return;
      }

      const eventIdsWithAvailability = eventResults.map((event) => event.id);

      if (eventIdsWithAvailability.length === 0)
      {
        // If no event IDs found, return the promotion data without events
        res.json(promotionResults);
        return;
      }
      connection.query(
        `SELECT * FROM availability WHERE event_id IN (${eventIdsWithAvailability.join(',')})`,
        (error, availabilityResults) =>
        {
          if (error)
          {
            console.error('Error executing availability query:', error);
            res.status(500).json({ error: 'Error executing availability query:', error });
            return;
          }

          const promotionsWithEvents = promotionResults.map((promotion) =>
          {
            const promotionEventIds = [
              promotion['event1-id'],
              promotion['event2-id'],
              promotion['event3-id'],
              promotion['event4-id']
            ].filter(Boolean);

            const promotionEvents = eventResults.filter((event) =>
              promotionEventIds.includes(event.id)
            );

            const promotionAvailability = availabilityResults.filter((availability) =>
              promotionEventIds.includes(availability.event_id)
            );

            return {
              ...promotion,
              events: promotionEvents,
              availability: promotionAvailability
            };
          });

          res.json(promotionsWithEvents);
        }
      );
    });
  });
});

exports.deletePromotion = catchAsync(async (req, res, next) =>
{
  const promotionId = req.params.id;

  const connection = database.getConnection();
  const sql = 'DELETE FROM promotion WHERE id = ?';

  connection.query(sql, [promotionId], (error, results) =>
  {
    if (error)
    {
      console.error('Error deleting promotion:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Check if any rows were affected by the delete
    if (results.affectedRows === 0)
    {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    // Return success response
    return res.status(200).json({ message: 'Promotion deleted successfully' });
  });
});

exports.updatePromotion = catchAsync(async (req, res, next) =>
{
  const promotionId = req.params.id;
  const {
    territoryId,
    ptype,
    pUrl,
    eventId1,
    eventId2,
    eventId3,
    eventId4,
    attendees,
    locked
  } = req.body;

  const connection = database.getConnection();
  const sql = 'UPDATE promotion SET `territory-id` = ?, `ptype` = ?, `p-url` = ?, `event1-id` = ?, `event2-id` = ?, `event3-id` = ?, `event4-id` = ?, `attendees` = ?, `edit-id` = ?, `locked` = ? WHERE `id` = ?';

  const values = [territoryId, ptype, pUrl, eventId1, eventId2, eventId3, eventId4, attendees, req.userData?.user?.id, locked, promotionId];
  console.log(values);

  connection.query(sql, values, (error, results) =>
  {

    if (error)
    {
      console.error('Error updating promotion:', error);
      return res.status(500).json({ error: 'Internal server error' + error });
    }

    // Check if any rows were affected by the update
    if (results.affectedRows === 0)
    {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    // Return success response
    return res.status(200).json({ message: 'Promotion updated successfully' });
  });
});

exports.addPromotion = catchAsync(async (req, res, next) =>
{
  const errors = validationResult(req);
  if (!errors.isEmpty())
  {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    territoryId,
    ptype,
    pUrl,
    eventId1,
    eventId2,
    eventId3,
    eventId4,
    attendees,
    locked
  } = req.body;

  const values = [
    territoryId,
    ptype,
    pUrl,
    eventId1,
    eventId2,
    eventId3,
    eventId4,
    attendees,
    req.userData?.user?.id,
    locked,
  ];

  const connection = database.getConnection();
  const sql = 'INSERT INTO promotion (`territory-id`, `ptype`, `p-url`, `event1-id`, `event2-id`, `event3-id`, `event4-id`, `attendees`, `edit-id`,`locked`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)';

  connection.query(sql, values, (error, results) =>
  {
    // Error handling
    if (error)
    {
      console.error('Error adding promotion:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Return success response
    return res.status(200).json({ message: 'Promotion added successfully' });
  });
});
