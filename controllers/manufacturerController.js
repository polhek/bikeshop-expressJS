const Bikepart = require('../models/bikepart');
const Category = require('../models/category');
const Manufacturer = require('../models/manufacturer');

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
