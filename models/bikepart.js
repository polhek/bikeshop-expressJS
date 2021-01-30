const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BikepartSchema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  stock: { type: Number, required: true },
  manufacturer: { type: Schema.Types.ObjectId, ref: 'Manufacturer' },
});

BikepartSchema.virtual('url').get(function () {
  return '/catalog/bikepart/' + this._id;
});

module.exports = mongoose.model('Bikepart', BikepartSchema);
