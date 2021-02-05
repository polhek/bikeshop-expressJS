const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Manufacturer = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  manufacturing_in: { type: String, required: true },
});

Manufacturer.virtual('count', {
  ref: 'Bikepart',
  localField: '_id',
  foreignField: 'manufacturer',
  count: true,
});

Manufacturer.virtual('url').get(function () {
  return '/catalog/manufacturer/' + this._id;
});

module.exports = mongoose.model('Manufacturer', Manufacturer);
