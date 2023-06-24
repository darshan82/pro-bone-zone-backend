const express = require('express');
const router = express.Router();
const controller = require("../controllers/staff")


router.get('/', controller.getStaffs);




module.exports = router;
