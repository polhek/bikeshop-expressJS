const Bikepart = require('../models/bikepart');
const Category = require('../models/category');
const Manufacturer = require('../models/manufacturer');

const async = require('async');

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
