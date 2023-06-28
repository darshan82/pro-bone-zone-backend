const express = require('express');
const router = express.Router();
const controller = require("../controllers/resource")
const { body, param } = require('express-validator');
const { getOneResource, getAllResources, updateResource, deleteResource } = require('../controllers/resource');


const validateResourceId = param('id').notEmpty().isInt().withMessage('Resource ID must be a non-empty integer');

// Validation rules for creating/updating a resource
const validateResource = [
    body('category').notEmpty().withMessage('Category must be one of: marketing, training, technology'),
    body('title').notEmpty(),
    body('viewers').notEmpty(),
    body('type').notEmpty().withMessage('Type must be one of: file, link, video'),
    body('filepath').notEmpty(),
    body('status').notEmpty().withMessage('Status must be one of: pending, live'),
];

router.post('/add', validateResource, controller.addResource)

router.get('/', getAllResources);
router.get('/:id', validateResourceId, getOneResource);
router.put('/:id', [validateResourceId, validateResource], updateResource);
router.delete('/:id', validateResourceId, deleteResource);

module.exports = router;

