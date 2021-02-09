const Bikepart = require('../models/bikepart');
const Category = require('../models/category');
const Manufacturer = require('../models/manufacturer');
const { body, validationResult } = require('express-validator');
const async = require('async');
const category = require('../models/category');

exports.manufacturerList = function (req, res, next) {
  Manufacturer.find()
    .populate('count')
    .exec(function (err, list_manufacturers) {
      if (err) {
        return next(err);
      }
      res.render('manufacturers_list', {
        title: 'List of Manufacturers',
        list_manufacturers: list_manufacturers,
      });
    });
};

exports.manufacturerDetail = function (req, res, next) {
  async.parallel(
    {
      manufacturer: function (callback) {
        Manufacturer.findById(req.params.id).exec(callback);
      },
      manufacturerItems: function (callback) {
        Bikepart.find({ manufacturer: req.params.id })
          .populate('category')
          .populate('manufacturer')
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.manufacturer == null) {
        let err = new Error('Manufacturer not found');
        err.status = 404;
        return next(err);
      }
      res.render('manufacturer_detail', {
        title: 'Manufacturer detail',
        manufacturer: results.manufacturer,
        manufacturer_items: results.manufacturerItems,
      });
    }
  );
};

exports.manufacturer_create_get = function (req, res, next) {
  res.render('manufacturer_form', { title: 'Create new manufacturer:' });
};

exports.manufacturer_create_post = [
  body('name', 'Name of the manufacturer must nob be empty!')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 10 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const manufacturer = new Manufacturer({
      name: req.body.name,
      description: req.body.description,
      manufacturing_in: req.body.manufacturing_in,
    });

    if (!errors.isEmpty()) {
      res.render('manufacturer_form', {
        title: 'Create new manufacturer',
        manufacturer: manufacturer,
        errors: errors.isArray(),
      });
      return;
    } else {
      Manufacturer.findOne({ name: req.body.name }).exec(function (
        err,
        found_manufacturer
      ) {
        if (err) {
          return next(err);
        }
        if (found_manufacturer) {
          res.redirect('/catalog/manufacturers');
        } else {
          manufacturer.save(function (err) {
            if (err) {
              return next(err);
            }
            res.redirect('/catalog/manufacturers');
          });
        }
      });
    }
  },
];
