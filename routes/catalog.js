var express = require('express');
var router = express.Router();

const bikepartController = require('../controllers/bikepartController');
const categoryController = require('../controllers/categoryController');
const manufacturerController = require('../controllers/manufacturerController');

// BIKEPART ROUTES
router.get('/', bikepartController.index);

//get request for create
router.get('/bikepart/create', bikepartController.bikepart_create_get);

// post requrest for creating new bikepart
router.post('/bikepart/create', bikepartController.bikepart_create_post);

router.get('/bikepart/:id/delete', bikepartController.bikepart_delete_get);

router.post('/bikepart/:id/delete', bikepartController.bikepart_delete_post);

router.get('/bikepart/:id/update/', bikepartController.bikepart_update_get);

router.post('/bikepart/:id/update/', bikepartController.bikepart_update_post);

// bikepart detail
router.get('/bikepart/:id', bikepartController.bikepart_detail);

//all bikeparts
router.get('/bikeparts', bikepartController.bikepartList);

// add new bikepart form

// CATEGORY ROUTES

// list of categories

router.get(
  '/manufacturer/create',
  manufacturerController.manufacturer_create_get
);

router.post(
  '/manufacturer/create',
  manufacturerController.manufacturer_create_post
);

router.get(
  '/manufacturer/:id/delete',
  manufacturerController.manufacturer_delete_get
);

router.post(
  '/manufacturer/:id/delete',
  manufacturerController.manufacturer_delete_post
);

router.get(
  '/manufacturer/:id/update',
  manufacturerController.manufacturer_update_get
);

router.post(
  '/manufacturer/:id/update',
  manufacturerController.manufacturer_update_post
);

router.get('/manufacturers', manufacturerController.manufacturerList);

router.get('/manufacturer/:id', manufacturerController.manufacturerDetail);

// category detail
router.get('/category/:id', categoryController.categoryDetail);

router.get('/categories', categoryController.categoryList);

// Manufacturer Route

//manufacturer detail

module.exports = router;
