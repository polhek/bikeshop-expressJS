const mongoose = require('mongoose');

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
  },
});

Category.virtual('url').get(function () {
  return '/catalog/category/' + this._id;
});

module.exports = mongoose.model('Category', Category);
