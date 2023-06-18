const express = require('express');
const router = express.Router();
const controller = require("../controllers/promotion")
const { validationResult, check } = require('express-validator');


module.exports = router;
