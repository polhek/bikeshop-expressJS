const Bikepart = require('../models/bikepart');
const Category = require('../models/category');
const Manufacturer = require('../models/manufacturer');

const async = require('async');

exports.index = function (req, res, next) {
  async.parallel(
    {
      bikepartsCount: function (callback) {
        Bikepart.countDocuments({}, callback);
      },
      categoryCount: function (callback) {
        Category.countDocuments({}, callback);
      },

      manufacturerCount: function (callback) {
        Manufacturer.countDocuments({}, callback);
      },
    },
    function (err, results) {
      if (err) {
        next(err);
      }

      res.render('index', {
        title: 'Inventory app - Bikeshop:',
        data: results,
      });
    }
  );
};
