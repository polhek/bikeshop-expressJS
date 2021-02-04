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

// Show all bikeparts
exports.bikepartList = function (req, res, next) {
  Bikepart.find({})
    .populate('category')
    .populate('manufacturer')
    .exec(function (err, list_parts) {
      if (err) {
        return next(err);
      }
      res.render('bikepart_List', {
        title: 'List of bikeparts',
        list_parts: list_parts,
      });
    });
};

exports.bikepart_detail = function (req, res, next) {
  async.parallel(
    {
      bikepart: function (callback) {
        Bikepart.findById(req.params.id)
          .populate('category')
          .populate('manufacturer')
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.bikepart == null) {
        var err = new Error('This bikepart cannot be found!');
        err.status = 404;
        return next(err);
      }
      res.render('bikepart_detail', {
        title: results.bikepart.name,
        bikepart: results.bikepart,
      });
    }
  );
};
