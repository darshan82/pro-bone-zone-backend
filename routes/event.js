const express = require('express');
const router = express.Router();
const controller = require("../controllers/event")
const { check, body } = require('express-validator');

router.get('/', controller.event);


// Delete an event
router.delete('/:id', controller.deleteEvent);
router.get('/:id', controller.getEventById);


// Update an event
router.put('/:id', [
    check('etype').notEmpty(),
    check('edate').notEmpty(),
    check('capacity').isInt().notEmpty(),
    check('time-start').notEmpty(),
    check('time-end').notEmpty(),
    check('city').notEmpty(),
    body('state').notEmpty(),
    check('street1').notEmpty(),
    check('street2'),
    check('street3'),
], controller.updateEvent);

// Add a new events
router.post('/', [
    body('territory_id').isInt().notEmpty(),
    body('etype').notEmpty(),
    body('edate').notEmpty(),
    body('capacity').isInt().notEmpty(),
    body('time-start').notEmpty(),
    body('time-end').notEmpty(),
    body('city').notEmpty(),
    body('street1').notEmpty(),
    body('state').notEmpty(),
    body('street2'),
    body('street3'),
], controller.addEvent);

module.exports = router;

module.exports = router;

