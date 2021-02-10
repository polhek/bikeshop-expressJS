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

exports.categoryDetail = function (req, res, next) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },

      category_items: function (callback) {
        Bikepart.find({ category: req.params.id })
          .populate('manufacturer')
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        next(err);
      }
      if (results.category == null) {
        let err = new Error('Category not found');
        err.status = 404;
        return next(err);
      }
      res.render('category_detail', {
        title: 'Category Detail',
        category: results.category,
        category_items: results.category_items,
      });
    }
  );
};
