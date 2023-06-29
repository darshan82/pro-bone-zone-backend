const express = require('express');
const { body, check, validationResult } = require('express-validator');
const router = express.Router();
const controller = require("../controllers/user");
const { verifyTheToken } = require('../middlewares/Auth');

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
], verifyTheToken, controller.signup);

// Get all licensees route
router.get('/licensee', verifyTheToken, controller.getAllLicensees);

// Add licensee route
router.post('/licensee/add', verifyTheToken, [
    check('permit').notEmpty(),
    check('name_first').notEmpty(),
    check('name_last').notEmpty(),
    check('phone').notEmpty(),
    check('email').notEmpty().isEmail(),
    check('pass').notEmpty(),
    check('notes'),
], controller.addLicensee);

// Update licensee route
router.put('/licensee/update/:id', verifyTheToken, [
    check('permit').notEmpty().withMessage('Permit is required').isIn(['licensee', 'staff', "admin"]).withMessage('Invalid permit value'),
    check('name_first').notEmpty(),
    check('name_last').notEmpty(),
    check('phone').notEmpty(),
    check('email').notEmpty().isEmail(),
    check('pass').notEmpty(),
    check('notes'),
], controller.updateLicensee);

// Delete licensee route
router.delete('/licensee/delete/:id', verifyTheToken, controller.deleteLicensee);

// Get licensee by ID route
router.get('/licensee/:id', verifyTheToken, controller.getUserLicenseeId);

module.exports = router;
