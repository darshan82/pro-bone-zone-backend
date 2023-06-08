const catchAsync = require("../utils/catchAsync");
const express = require('express');
const router = express.Router();
const controller = require("../controllers/user")
const { validationResult, check } = require('express-validator');

router.post('/login',
    [
        check('email').isEmail().withMessage('Invalid email'),
        check('password').notEmpty().withMessage('Password is required'),
    ], controller.login);

router.post('/signup',
    [
        check('permit').notEmpty().withMessage('Permit is required').isIn(['admin', 'licensee', 'staff']).withMessage('Invalid permit value'),
        check('nameFirst').notEmpty().withMessage('First name is required'),
        check('nameLast').notEmpty().withMessage('Last name is required'),
        check('phone').notEmpty().withMessage('Phone number is required'),
        check('email').isEmail().withMessage('Invalid email'),
        check('pass').notEmpty().withMessage('Password is required'),
    ]
    , controller.signup);

module.exports = router;
