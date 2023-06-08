const catchAsync = require("../utils/catchAsync");
const express = require('express');
const router = express.Router();
const controller = require("../controllers/territory")

router.get('/', controller.territory);

module.exports = router;
