const express = require('express');
const router = express.Router();
const controller = require("../controllers/promotion")
const { validationResult, check } = require('express-validator');






router.get('/detail/:promotionId', controller.getPromotionById)

router.get('/', controller.getAllPromotions)


router.delete('/:id', controller.deletePromotion);
router.put('/:id', [
    check('territoryId').isInt().notEmpty(),
    check('ptype').notEmpty(),
    check('pUrl').notEmpty(),
    check('eventId1').isInt().notEmpty(),
    check('eventId2').optional({ nullable: true }).isInt(),
    check('eventId3').optional({ nullable: true }).isInt(),
    check('eventId4').optional({ nullable: true }).isInt(),
    check('attendees').optional({ nullable: true }).isInt(),
], controller.updatePromotion);

router.post('/add', [
    check('territoryId').isInt().notEmpty(),
    check('ptype').notEmpty(),
    check('pUrl').notEmpty(),
    check('eventId1').isInt().notEmpty(),
    check('eventId2').optional({ nullable: true }).isInt(),
    check('eventId3').optional({ nullable: true }).isInt(),
    check('eventId4').optional({ nullable: true }).isInt(),
    check('attendees').optional({ nullable: true }).isInt(),
], controller.addPromotion);

module.exports = router;

