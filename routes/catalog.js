var express = require('express');
var router = express.Router();

const bikepartController = require('../controllers/bikepartController');

// BIKEPART ROUTES
router.get('/', bikepartController.index);

router.get('/bikeparts', bikepartController.bikepartList);

// CATEGORY ROUTES

// Manufacturer Route

module.exports = router;
