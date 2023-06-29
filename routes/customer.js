const express = require('express');
const router = express.Router();
const controller = require("../controllers/customer")
const { param, body } = require('express-validator');

router.post('/', [
    body('territory_id').notEmpty().isInt().withMessage('Invalid territory ID'),
    body('name_first').notEmpty().withMessage('First name is required'),
    body('name_last').notEmpty().withMessage('Last name is required'),
    body('email').notEmpty().isEmail().withMessage('Invalid email'),
    body('phone').notEmpty().withMessage('Phone number is required'),
], controller.addCustomer);


router.put('/:customerId', [
    param('customerId').notEmpty().isInt().withMessage('Invalid customer ID'),
    body('territory_id').optional().isInt().withMessage('Invalid territory ID'),
    body('name-first').optional().notEmpty().withMessage('First name is required'),
    body('name-last').optional().notEmpty().withMessage('Last name is required'),
    body('email').optional().isEmail().withMessage('Invalid email'),
    body('phone').optional().notEmpty().withMessage('Phone number is required'),
], controller.updateCustomer);


// Delete a customer
router.delete('/:customerId', [
    param('customerId').notEmpty().isInt().withMessage('Invalid customer ID'),
], controller.deleteCustomer);

router.get('/', controller.getCustomerList);

// Get a single customer by ID
router.get('/:customerId', [
    param('customerId').notEmpty().isInt().withMessage('Invalid customer ID'),
], controller.getCustomer);



module.exports = router;
