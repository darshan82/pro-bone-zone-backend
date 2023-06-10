const express = require('express');
const controller = require("../controllers/appointment")

const { check } = require("express-validator");

const router = express.Router();


router.get('/', controller.getAllAppointments);
router.post('/add',
    [check('eventId').notEmpty().withMessage('Event ID is required'),
    check('customerId').notEmpty().withMessage('Customer ID is required'),
    check('timeslot').notEmpty().withMessage('Timeslot is required'),
    check('interest').notEmpty().withMessage('Interest is required'),
    check('companyId').notEmpty().withMessage('Company ID is required'),
    check('consultant').notEmpty().withMessage('Consultant is required'),
    check('rating').notEmpty().withMessage('Rating is required'),
    check('feedback').notEmpty().withMessage('Feedback is required'),
    check('advance').notEmpty().withMessage('Advance is required'),
    check('editId').notEmpty().withMessage('Edit ID is required'),
    ]
    , controller.addAppointments);
router.post('/update',
    [
        check('eventId').notEmpty().withMessage('Event ID is required'),
        check('customerId').notEmpty().withMessage('Customer ID is required'),
        check('timeslot').notEmpty().withMessage('Timeslot is required'),
        check('interest').notEmpty().withMessage('Interest is required'),
        check('companyId').notEmpty().withMessage('Company ID is required'),
        check('consultant').notEmpty().withMessage('Consultant is required'),
        check('rating').notEmpty().withMessage('Rating is required'),
        check('feedback').notEmpty().withMessage('Feedback is required'),
        check('advance').notEmpty().withMessage('Advance is required'),
        check('editId').notEmpty().withMessage('Edit ID is required'),
    ]
    , controller.updateAppointment);
router.post('/delete', [
    check('id').notEmpty().withMessage('Appointment ID is required'),

], controller.deleteAppointment);





module.exports = router;

