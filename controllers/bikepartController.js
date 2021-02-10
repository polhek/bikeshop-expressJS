const Bikepart = require('../models/bikepart');
const Category = require('../models/category');
const Manufacturer = require('../models/manufacturer');

const async = require('async');
const { body, validationResult } = require('express-validator');

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
        let err = new Error('This bikepart cannot be found!');
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

exports.bikepart_create_get = function (req, res, next) {
  async.parallel(
    {
      manufacturers: function (callback) {
        Manufacturer.find(callback);
      },
      categories: function (callback) {
        Category.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render('bikepart_form', {
        title: 'Create new bikepart',
        categories: results.categories,
        manufacturers: results.manufacturers,
      });
    }
  );
};

exports.bikepart_create_post = [
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 10 })
    .escape(),
  body('price', 'You must specify price.').isFloat({ min: 1, max: 9999999 }),
  body('category', 'You must choose category.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('stock', 'You must specify stock of item.').isInt({
    min: 0,
    max: 99999,
  }),
  body('manufacturer', 'You must specify manufacturer')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const bikepart = new Bikepart({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      manufacturer: req.body.manufacturer,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          manufacturers: function (callback) {
            Manufacturer.find(callback);
          },
          categories: function (callback) {
            Category.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }

          res.render('bikepart_form', {
            title: 'Create new bikepart',
            manufacturers: results.manufacturers,
            categories: results.categories,
            bikepart: bikepart,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      bikepart.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect(bikepart.url);
      });
    }
  },
];

exports.bikepart_update_get = (req, res, next) => {
  async.parallel(
    {
      bikepart: function (callback) {
        Bikepart.findById(req.params.id)
          .populate('manufacturer')
          .populate('category')
          .exec(callback);
      },
      manufacturers: function (callback) {
        Manufacturer.find(callback);
      },
      categories: function (callback) {
        Category.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.bikepart == null) {
        let err = new Error('Bikepart not found!');
        err.status = 404;
        return next(err);
      }
      res.render('bikepart_form', {
        title: 'Update bikepart',
        manufacturers: results.manufacturers,
        categories: results.categories,
        bikepart: results.bikepart,
      });
    }
  );
};

exports.bikepart_update_post = [
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 10 })
    .escape(),
  body('price', 'You must specify price.').isFloat({ min: 1, max: 9999999 }),
  body('category', 'You must choose category.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('stock', 'You must specify stock of item.').isInt({
    min: 0,
    max: 99999,
  }),
  body('manufacturer', 'You must specify manufacturer')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const bikepart = new Bikepart({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      manufacturer: req.body.manufacturer,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          manufacturers: function (callback) {
            Manufacturer.find(callback);
          },
          categories: function (callback) {
            Category.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }

          res.render('bikepart_form', {
            title: 'Update Bikepart',
            manufacturers: results.manufacturers,
            categories: results.categories,
            bikepart: results.bikepart,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      Bikepart.findByIdAndUpdate(
        req.params.id,
        bikepart,
        {},
        function (err, thebikepart) {
          if (err) {
            return next(err);
          }
          res.redirect(thebikepart.url);
        }
      );
    }
  },
];

exports.bikepart_delete_get = function (req, res, next) {
  Bikepart.findById(req.params.id)
    .populate('manufacturer')
    .populate('category')
    .exec(function (err, bikepart) {
      if (err) {
        return next(err);
      }
      res.render('bikepart_delete', {
        title: 'Do you really want to delete this bikepart?',
        bikepart: bikepart,
      });
    });
};

exports.bikepart_delete_post = function (req, res, next) {
  console.log(req.params.id);
  Bikepart.findByIdAndRemove(req.params.id, function deleteBikepart(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/catalog/bikeparts');
  });
};
