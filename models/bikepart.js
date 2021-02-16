const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BikepartSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  stock: { type: Number, required: true, min: 0 },
  manufacturer: {
    type: Schema.Types.ObjectId,
    ref: 'Manufacturer',
    required: true,
  },
  imgFile: { type: String, required: true },
});

BikepartSchema.virtual('url').get(function () {
  return '/catalog/bikepart/' + this._id;
});

module.exports = mongoose.model('Bikepart', BikepartSchema);
