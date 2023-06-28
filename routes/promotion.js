const express = require('express');
const router = express.Router();
const controller = require("../controllers/promotion")
const { check } = require('express-validator');
const { verifyTheToken } = require('../middlewares/Auth');

router.get('/detail/:promotionId', controller.getPromotionById)

router.get('/', verifyTheToken, controller.getAllPromotions)

router.delete('/:id', verifyTheToken, controller.deletePromotion);
router.put('/:id', verifyTheToken, [
    check('territoryId').isInt().notEmpty(),
    check('ptype').notEmpty(),
    check('pUrl').notEmpty(),
    check('eventId1').isInt().notEmpty(),
    check('eventId2').optional({ nullable: true }).isInt(),
    check('eventId3').optional({ nullable: true }).isInt(),
    check('eventId4').optional({ nullable: true }).isInt(),
], controller.updatePromotion);

router.post('/add', verifyTheToken, [
    check('territoryId').isInt().notEmpty(),
    check('ptype').notEmpty(),
    check('pUrl').notEmpty(),
    check('eventId1').isInt().notEmpty(),
    check('eventId2').optional({ nullable: true }).isInt(),
    check('eventId3').optional({ nullable: true }).isInt(),
    check('eventId4').optional({ nullable: true }).isInt(),
], controller.addPromotion);

module.exports = router;

