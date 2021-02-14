const Bikepart = require('../models/bikepart');

const Manufacturer = require('../models/manufacturer');
const { body, validationResult } = require('express-validator');
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

exports.manufacturer_create_get = function (req, res) {
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

exports.manufacturer_update_get = function (req, res, next) {
  Manufacturer.findById(req.params.id, (err, manufacturer) => {
    if (err) {
      return next(err);
    }
    if (manufacturer == null) {
      let err = new Error('Manufacturer cannot be found!');
      err.status = 404;
      return next(err);
    }
    res.render('manufacturer_form', {
      title: 'Update manufacturer',
      manufacturer: manufacturer,
    });
  });
};

exports.manufacturer_update_post = [
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
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render('manufacturer_form', {
        title: 'Update manufacturer',
        manufacturer: manufacturer,
        errors: errors.isArray(),
      });
      return;
    } else {
      Manufacturer.findByIdAndUpdate(
        req.params.id,
        manufacturer,
        {},
        function (err) {
          if (err) {
            return next(err);
          }
          res.redirect('/catalog/manufacturers');
        }
      );
    }
  },
];

exports.manufacturer_delete_get = function (req, res, next) {
  async.parallel(
    {
      manufacturer: function (callback) {
        Manufacturer.findById(req.params.id).exec(callback);
      },
      manufacturer_bikeparts: function (callback) {
        Bikepart.find({ manufacturer: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.manufacturer == null) {
        res.redirect('/catalog/manufacturers');
      }
      res.render('manufacturer_delete', {
        title: 'Delete manufacturer',
        manufacturer: results.manufacturer,
        manufacturer_items: results.manufacturer_bikeparts,
      });
    }
  );
};

exports.manufacturer_delete_post = function (req, res, next) {
  async.parallel(
    {
      manufacturer: function (callback) {
        Manufacturer.findById(req.body.manufacturerid).exec(callback);
      },
      manufacturer_bikeparts: function (callback) {
        Bikepart.find({ manufacturer: req.body.manufacturerid }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        console.log(err);
        return next(err);
      }
      if (results.manufacturer_bikeparts.length > 0) {
        res.render('manufacturer_delete', {
          title: 'Delete manufacturer',
          manufacturer: results.manufacturer,
          manufacturer_items: results.manufacturer_bikeparts,
        });
        return;
      } else {
        Manufacturer.findByIdAndRemove(
          req.body.manufacturerid,
          function deleteManufacturer(err) {
            if (err) {
              return next(err);
            }
            res.redirect('/catalog/manufacturers');
          }
        );
      }
    }
  );
};
