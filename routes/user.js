const express = require('express');
const { body, check, validationResult } = require('express-validator');
const router = express.Router();
const controller = require("../controllers/user");

// Login route
router.post('/login', [
    check('email').isEmail().withMessage('Invalid email'),
    check('password').notEmpty().withMessage('Password is required')
], controller.login);

// Signup route
router.post('/signup', [
    body('permit').notEmpty().isIn(['admin', 'licensee', 'staff']).withMessage('Invalid permit value'),
    body('nameFirst').notEmpty().withMessage('First name is required'),
    body('nameLast').notEmpty().withMessage('Last name is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('pass').notEmpty().withMessage('Password is required'),
    body('territoryId').notEmpty().withMessage('Territory ID is required')
], controller.signup);

// Get all licensees route
router.get('/licensee', controller.getAllLicensees);

// Add licensee route
router.post('/licensee/add', [
    check('permit').notEmpty(),
    check('name_first').notEmpty(),
    check('name_last').notEmpty(),
    check('phone').notEmpty(),
    check('email').notEmpty().isEmail(),
    check('pass').notEmpty(),
    check('notes'),
    check('edit_id').isInt().notEmpty()
], controller.addLicensee);

// Update licensee route
router.put('/licensee/update/:id', [
    check('permit').notEmpty().withMessage('Permit is required').isIn(['licensee', 'staff']).withMessage('Invalid permit value'),
    check('name_first').notEmpty(),
    check('name_last').notEmpty(),
    check('phone').notEmpty(),
    check('email').notEmpty().isEmail(),
    check('pass').notEmpty(),
    check('notes'),
    check('edit_id').isInt().notEmpty()
], controller.updateLicensee);

// Delete licensee route
router.delete('/licensee/delete/:id', controller.deleteLicensee);

// Get licensee by ID route
router.get('/licensee/:id', controller.getUserLicenseeId);

module.exports = router;
