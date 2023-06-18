const catchAsync = require("../utils/catchAsync");
const express = require('express');
const router = express.Router();
const controller = require("../controllers/user")
const { validationResult, check, body } = require('express-validator');

router.post('/login',
    [
        check('email').isEmail().withMessage('Invalid email'),
        check('password').notEmpty().withMessage('Password is required'),
    ], controller.login);

router.post('/signup',
    [
        body('permit').notEmpty().withMessage('Permit is required').isIn(['admin', 'licensee', 'staff']).withMessage('Invalid permit value'),
        body('nameFirst').notEmpty().withMessage('First name is required'),
        body('nameLast').notEmpty().withMessage('Last name is required'),
        body('phone').notEmpty().withMessage('Phone number is required'),
        body('email').isEmail().withMessage('Invalid email'),
        body('pass').notEmpty().withMessage('Password is required'),
        body('territoryId').notEmpty().withMessage('territory-id is required'),
    ]
    , controller.signup);


router.get('/licensee', controller.getAllLicensees);
router.post('/licensee/add', [
    // Validation rules using express-validator
    check('permit').equals('licensee').notEmpty(),
    check('name_first').notEmpty(),
    check('name_last').notEmpty(),
    check('phone').notEmpty(),
    check('email').notEmpty().isEmail(),
    check('pass').notEmpty(),
    check('notes'),
    check('edit_id').isInt().notEmpty()
], controller.addLicensee);
router.put('/licensee/update/:id', [
    // Validation rules using express-validator
    check('permit').notEmpty().withMessage('Permit is required').isIn(['licensee', 'staff']).withMessage('Invalid permit value'),
    check('name_first').notEmpty(),
    check('name_last').notEmpty(),
    check('phone').notEmpty(),
    check('email').notEmpty().isEmail(),
    check('pass').notEmpty(),
    check('notes'),
    check('edit_id').isInt().notEmpty()
], controller.updateLicensee);
router.delete('/licensee/delete/:id', controller.deleteLicensee);
module.exports = router;
