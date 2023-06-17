const express = require('express');
const controller = require("../controllers/appointment")

const { check, body, param, query } = require("express-validator");

const router = express.Router();


router.get('/', [
    query('eventId').notEmpty().isInt().withMessage('Invalid event ID')
  ], controller.getAppointmentsByEventId);

router.post('/add',
    [
        body('date'),
        body('firstName').notEmpty(),
        body('lastName').notEmpty(),
        body('email').isEmail(),
        body('phone').notEmpty(),
        body('type').isIn(['family-law', 'business-law']),
        body('time').isString(),
        body('description').isString(),
        body('promotionId').notEmpty().withMessage('Promotion ID is required'),
        body('eventId').notEmpty().withMessage('Event ID is required'),

    ]
    , controller.addAppointments);

router.delete('/delete/:id', [
    param('id').notEmpty().withMessage('Appointment ID is required'),

], controller.deleteAppointment);





module.exports = router;

