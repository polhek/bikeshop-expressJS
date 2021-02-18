var express = require('express');
const multer = require('multer');
const path = require('path');
var router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/images');
  },
  filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

function authenticatorFn(req, res, next) {
  var auth;

  // check whether an autorization header was send
  if (req.headers.authorization) {
    auth = new Buffer(req.headers.authorization.substring(6), 'base64')
      .toString()
      .split(':');
  }

  if (!auth || auth[0] !== 'testuser' || auth[1] !== 'testpassword') {
    // any of the tests failed
    // send an Basic Auth request (HTTP Code: 401 Unauthorized)
    res.statusCode = 401;
    // MyRealmName can be changed to anything, will be prompted to the user
    res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
    // this will displayed in the browser when authorization is cancelled
    res.redirect(302, '/');
  } else {
    // continue with processing, user was authenticated
    next();
  }
}

// function getUnauthorizedResponse(req) {
//   return req.auth
//     ? 'Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected'
//     : 'No credentials provided';
// }

const bikepartController = require('../controllers/bikepartController');
const categoryController = require('../controllers/categoryController');
const manufacturerController = require('../controllers/manufacturerController');

// BIKEPART ROUTES
router.get('/', bikepartController.index);

//get request for create
router.get(
  '/bikepart/create',
  authenticatorFn,
  bikepartController.bikepart_create_get
);

// post requrest for creating new bikepart
router.post(
  '/bikepart/create',
  upload.single('imgFile'),
  bikepartController.bikepart_create_post
);

router.get(
  '/bikepart/:id/delete',
  authenticatorFn,
  bikepartController.bikepart_delete_get
);

router.post('/bikepart/:id/delete', bikepartController.bikepart_delete_post);

router.get(
  '/bikepart/:id/update/',
  authenticatorFn,
  bikepartController.bikepart_update_get
);

router.post(
  '/bikepart/:id/update/',
  upload.single('imgFile'),
  bikepartController.bikepart_update_post
);

// bikepart detail
router.get('/bikepart/:id', bikepartController.bikepart_detail);

//all bikeparts
router.get('/bikeparts', bikepartController.bikepartList);

// add new bikepart form

// CATEGORY ROUTES

// list of categories

router.get(
  '/manufacturer/create',
  authenticatorFn,
  manufacturerController.manufacturer_create_get
);

router.post(
  '/manufacturer/create',
  manufacturerController.manufacturer_create_post
);

router.get(
  '/manufacturer/:id/delete',
  authenticatorFn,
  manufacturerController.manufacturer_delete_get
);

router.post(
  '/manufacturer/:id/delete',
  manufacturerController.manufacturer_delete_post
);

router.get(
  '/manufacturer/:id/update',
  authenticatorFn,
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
