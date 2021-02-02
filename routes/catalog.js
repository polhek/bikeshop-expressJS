var express = require('express');
var router = express.Router();

const bikepartController = require('../controllers/bikepartController');

// BIKEPART ROUTES
router.get('/', bikepartController.index);

// CATEGORY ROUTES

// Manufacturer Route

module.exports = router;
