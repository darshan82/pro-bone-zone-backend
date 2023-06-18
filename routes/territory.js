const catchAsync = require("../utils/catchAsync");
const express = require('express');
const router = express.Router();
const controller = require("../controllers/territory")
const { validationResult, check } = require('express-validator');

router.get('/', controller.territory);
router.post('/add', [
    // Validation rules using express-validator
    check('licenseeId').isInt().notEmpty(),
    check('state').notEmpty(),
    check('county').notEmpty(),
    check('defaultUrl').notEmpty(),
    check('notes'),
    check('editId').isInt().notEmpty()
], controller.addTerritory);



router.put('/update/:id', [
    // Validation rules using express-validator
    check('licenseeId').isInt().notEmpty(),
    check('state').notEmpty(),
    check('county').notEmpty(),
    check('defaultUrl').notEmpty(),
    check('notes'),
], controller.updateTerritory);
router.delete('/delete/:id', controller.deleteTerritory);

module.exports = router;
