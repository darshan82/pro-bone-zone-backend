const catchAsync = require("../utils/catchAsync");
const express = require('express');
const router = express.Router();
const controller = require("../controllers/sponsor")
const { validationResult, check, param } = require('express-validator');



router.post('/add', [
    check('territoryId').notEmpty().withMessage('Territory ID is required'),
    check('scategory').notEmpty().withMessage('Category is required'),
    check('stype').notEmpty().withMessage('Type is required'),
    check('organizationName').notEmpty().withMessage('Organization name is required'),
    check('webpage').notEmpty().withMessage('Webpage is required'),
    check('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
    check('phone').notEmpty().withMessage('Phone is required'),
    check('editId').notEmpty().withMessage('Edit ID is required'),
], controller.addSponsor);


router.get('/:territoryId', [
    param('territoryId').notEmpty().withMessage('Territory ID must be an integer'),
],controller.getSponsorsBasedOnTerritoryId)

module.exports = router;
