const catchAsync = require("../utils/catchAsync");
const express = require('express');
const router = express.Router();
const controller = require("../controllers/resource")
const { validationResult, check } = require('express-validator');




router.post('/add', controller.addResource)
module.exports = router;

