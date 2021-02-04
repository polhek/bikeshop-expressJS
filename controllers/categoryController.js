const Bikepart = require('../models/bikepart');
const Category = require('../models/category');
const Manufacturer = require('../models/manufacturer');

const async = require('async');

exports.categoryList = function (req, res, next) {
  Category.find()
    .populate('count')
    .exec(function (err, list_categories) {
      if (err) {
        return next(err);
      }
      res.render('category_list', {
        title: 'List of Categories',
        category_list: list_categories,
      });
    });
};
