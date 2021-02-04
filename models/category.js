const mongoose = require('mongoose');
const Bikepart = require('./bikepart');

const Schema = mongoose.Schema;

const Category = new Schema({
  name: {
    type: String,
    required: true,
    enum: [
      'Groupsets',
      'Pedals',
      'Saddles',
      'Frames',
      'Tires',
      'Wheels',
      'Headsets',
    ],
    default: 'Frames',
  },
});

Category.virtual('count', {
  ref: 'Bikepart',
  localField: '_id',
  foreignField: 'category',
  count: true,
});

Category.virtual('url').get(function () {
  return '/catalog/category/' + this._id;
});

module.exports = mongoose.model('Category', Category);
