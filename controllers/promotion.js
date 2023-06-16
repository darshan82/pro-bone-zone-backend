
const { validationResult } = require('express-validator');
const database = require('../sqlconnect');
const catchAsync = require("../utils/catchAsync");


exports.addPromotion = catchAsync(async (req, res, next) =>
{
  const errors = validationResult(req);
  if (!errors.isEmpty())
  {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    territoryId,
    pType,
    pUrl,
    event1Id,
    event2Id,
    event3Id,
    event4Id,
    attendees,
    editId
  } = req.body;

  const values = [
    territoryId,
    pType,
    pUrl,
    event1Id,
    event2Id,
    event3Id,
    event4Id,
    attendees,
    editId
  ];

  const connection = database.getConnection();
  const sql =
    'INSERT INTO promotion (`territory-id`, `ptype`, `p-url`, `event1-id`, `event2-id`, `event3-id`, `event4-id`, `attendees`, `edit-id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

  connection.query(sql, values, (error, results) =>
  {
    if (error)
    {
      console.error('Error inserting data into promotion table:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Return success response
    return res.status(200).json({ message: 'Data inserted successfully' });
  });
});

exports.getPromotionById = catchAsync(async (req, res, next) => {
  const promotionId = req.params.promotionId; // Assuming you pass the promotion ID as a URL parameter

  const connection = database.getConnection();

  connection.query(
    `SELECT * FROM promotion WHERE id = ${promotionId}`,
    (error, promotionResults) => {
      if (error) {
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

      if (eventIds.length === 0) {
        // If no event IDs found, return the promotion data without events
        res.json(promotionData);
        return;
      }

      connection.query(
        `SELECT * FROM event WHERE id IN (${eventIds.join(',')})`,
        (error, eventResults) => {
          if (error) {
            console.error('Error executing event query:', error);
            res.status(500).json({ error: 'Error executing event query:', error });
            return;
          }

          const eventIdsWithAvailability = eventResults.map((event) => event.id);

          connection.query(
            `SELECT * FROM availability WHERE event_id IN (${eventIdsWithAvailability.join(
              ','
            )})`,
            (error, availabilityResults) => {
              if (error) {
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
        }
      );
    }
  );
});

// exports.getPromotionById = catchAsync(async (req, res, next) =>
// {
//   const { promotionId } = req.params; // Assuming you pass the promotion ID in the request params

//   const connection = database.getConnection();
//   connection.query(
//     `SELECT p.*, e.* 
//   FROM promotion p
//   LEFT JOIN event e ON p.\`event1-id\` = e.id OR p.\`event2-id\` = e.id OR p.\`event3-id\` = e.id OR p.\`event4-id\` = e.id
//   WHERE p.id = ?`,
//     [promotionId],
//     (error, results) =>
//     {
//       if (error || results.length === 0)
//       {
//         console.error('Error executing query:', error);
//         res.status(400).json({ error: 'Error executing query:', error });
//         return;
//       }

//       // Process the query results
//       res.json(results);
//     }
//   );
// });
