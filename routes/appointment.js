const express = require('express');
const controller = require("../controllers/appointment")


const router = express.Router();


router.get('/', controller.getAppointments);
router.post('/add', controller.addAppointments);



module.exports = router;

