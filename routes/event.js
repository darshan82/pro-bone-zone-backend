const catchAsync = require("../utils/catchAsync");
const express = require('express');
const router = express.Router();
const controller = require("../controllers/event")
const { validationResult, check } = require('express-validator');

router.get('/', controller.event);

module.exports = router;

