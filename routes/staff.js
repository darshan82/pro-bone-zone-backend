const express = require('express');
const router = express.Router();
const controller = require("../controllers/staff")
const { validationResult, check } = require('express-validator');


router.get('/', controller.getStaffs);




module.exports = router;
