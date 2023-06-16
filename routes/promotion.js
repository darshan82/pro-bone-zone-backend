const express = require('express');
const router = express.Router();
const controller = require("../controllers/promotion")
const { validationResult, check } = require('express-validator');




router.post('/add',
    [
        check('territoryId').notEmpty().withMessage('Territory ID is required'),
        check('pType').notEmpty().withMessage('Promotion Type is required'),
        check('pUrl').isURL().withMessage('Invalid URL'),
        check('event1Id').notEmpty().withMessage('Event 1 ID is required'),
    ]
    , controller.addPromotion)

router.get('/detail/:promotionId', controller.getPromotionById)
module.exports = router;

