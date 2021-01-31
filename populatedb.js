#! /usr/bin/env node

console.log(
  'This script populates some test bikeparts, categories and manufacturers to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Bikepart = require('./models/bikepart');
var Category = require('./models/category');
var Manufacturer = require('./models/manufacturer');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var bikeparts = [];
var categories = [];
var manufacturers = [];

// Populate bikeparts...
function bikepartCreate(
  name,
  description,
  price,
  category,
  stock,
  manufacturer,
  cb
) {
  bikepartDetail = {
    name: name,
    description: description,
    price: price,
    category: category,
    stock: stock,
    manufacturer: manufacturer,
  };

  var bikerpart_item = new Bikepart(bikepartDetail);

  bikerpart_item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Bikepart: ' + bikerpart_item);
    bikeparts.push(bikerpart_item);
    cb(null, bikerpart_item);
  });
}

function categoryCreate(name, cb) {
  var category = new Category({ name: name });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category);
    cb(null, category);
  });
}

function manufacturerCreate(name, description, manufacturing_in, cb) {
  manufacturer_detail = {
    name: name,
    description: description,
    manufacturing_in: manufacturing_in,
  };

  var manufacturer = new Manufacturer(manufacturer_detail);
  manufacturer.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Manufacturer: ' + manufacturer);
    manufacturers.push(manufacturer);
    cb(null, manufacturer);
  });
}

function createCategoriesManufacturers(cb) {
  async.series(
    [
      function (callback) {
        manufacturerCreate(
          'Shimano',
          'Shimano, Inc. is a Japanese multinational manufacturer of cycling components, fishing tackle and rowing equipment. It produced golf supplies until 2005 and snowboarding gear until 2008. Headquartered in Sakai, Japan, the company has 32 consolidated subsidiaries and 11 unconsolidated subsidiaries.',
          'Japan',
          callback
        );
      },
      function (callback) {
        manufacturerCreate(
          'Campagnolo',
          "Campagnolo is an Italian manufacturer of bicycle components with headquarters in Vicenza, Italy. The components are organised as groupsets, and are a near-complete collection of a bicycle's mechanical parts.",
          'Italy',
          callback
        );
      },
      function (callback) {
        manufacturerCreate(
          'Specialized',
          `Specialized Bicycle Components, Inc., colloquially known as and stylized as SPECIALIZED, is an American company that designs, manufactures and markets bicycles, bicycle components and related products under the brand name "Specialized", as well as the premium and professional oriented "S-works".`,
          'United States',
          callback
        );
      },
      function (callback) {
        manufacturerCreate(
          'Continental',
          `Continental AG, commonly known as Continental or colloquially as Conti, is a German multinational automotive parts manufacturing company specializing in brake systems, interior electronics, automotive ... `,
          'Germany',
          callback
        );
      },
      function (callback) {
        manufacturerCreate(
          'Fulcrum Wheels',
          'Fulcrum Wheels srl is a wholly owned company of Campagnolo that produces road bicycle and mountain bike wheelsets compatible with Campagnolo, Shimano and Sram drivetrains.',
          'Italy',
          callback
        );
      },
      function (callback) {
        categoryCreate('Groupsets', callback);
      },
      function (callback) {
        categoryCreate('Frames', callback);
      },
      function (callback) {
        categoryCreate('Saddles', callback);
      },
      function (callback) {
        categoryCreate('Wheels', callback);
      },
      function (callback) {
        categoryCreate('Pedals', callback);
      },
      function (callback) {
        categoryCreate('Tires', callback);
      },
    ],
    // optional callback
    cb,
    console.log(categories)
  );
}

function createBikeparts(cb) {
  async.parallel(
    [
      function (callback) {
        bikepartCreate(
          'Dura Ace Groupset R9100 ',
          `The DURA-ACE groupset is the result of Shimano's ongoing passion for technology. This is reflected in every single component in the groupset. All components are joined together to work as one, reinforcing each other for unparalleled performance. This is how DURA-ACE achieves ultimate supremacy.`,
          1530.77,
          categories[0],
          55,
          manufacturers[0],
          callback
        );
      },
      function (callback) {
        bikepartCreate(
          'Campagnolo Record Groupset 2x12-speed - Mechanical Rim Brakes',
          `Campagnolo never ceases to evolve and the range of drivetrains has taken on a new sophisticated element: The 12-speed Record mechanical groupset is the iconic brand that has personified the world's greatest successes in cycling, in both professional and amateur races. The victories race bikes have achieved over the years with this groupset demonstrate the highest level of quality present in the processing, technology and premium materials that have always made it stand above the rest as a unique trademark product.`,
          1414.77,
          categories[0],
          13,
          manufacturers[1],
          callback
        );
      },
      function (callback) {
        bikepartCreate(
          'Fulcrum Racing Zero Wheelset - Clincher',
          `The Racing Zero wheels are pretty much the gold standard for high-level aluminum road bike wheels. They convince with a unmistakable character, an extreme riding precision and the ability to transmit energy almost lossless onto the asphalt. Race after race, Zero wheels have become a synonymous for quality, performance, reliability and victory!`,
          768.9,
          categories[3],
          32,
          manufacturers[4],
          callback
        );
      },
      function (callback) {
        bikepartCreate(
          'Continental Grand Prix 4000 S II Tubular Tire 28 Inch x 22 mm',
          `This tubular tire offers a great blending of comfort, puncture protection and efficiently rolling. A seamless casing design improves seating on the rim and the tyre's uniformity. Furthermore the 4000 S II tubular features Vectran™ breaker for unsurpassed puncture protection and the BlackChili compound for low rolling resistance and superb grip. A winning tyre, handmade in Germany.`,
          64.49,
          categories[5],
          103,
          manufacturers[3],
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createCategoriesManufacturers, createBikeparts],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('Bikeparts: ' + bikeparts);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
