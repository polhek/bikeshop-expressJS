var express = require('express');
var router = express.Router();

const bikepartController = require('../controllers/bikepartController');
const categoryController = require('../controllers/categoryController');
const manufacturerController = require('../controllers/manufacturerController');

// BIKEPART ROUTES
router.get('/', bikepartController.index);

router.get('/bikepart/create', bikepartController.bikepart_create_get);

router.post('/bikepart/create', bikepartController.bikepart_create_post);
//all bikeparts
router.get('/bikeparts', bikepartController.bikepartList);

// bikepart detail
router.get('/bikepart/:id', bikepartController.bikepart_detail);

// add new bikepart form

// CATEGORY ROUTES

// list of categories
router.get('/categories', categoryController.categoryList);

// category detail
router.get('/category/:id', categoryController.categoryDetail);

// Manufacturer Route
router.get('/manufacturers', manufacturerController.manufacturerList);

//manufacturer detail

router.get('/manufacturer/:id', manufacturerController.manufacturerDetail);

module.exports = router;
