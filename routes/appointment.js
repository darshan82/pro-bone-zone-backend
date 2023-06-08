const express = require('express');
const controller = require("../controllers/appointment")


const router = express.Router();


router.get('/', controller);


module.exports = router;

