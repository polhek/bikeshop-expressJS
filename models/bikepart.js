const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BikepartSchema = new Schema({
  // Tuki
});

module.exports = mongoose.model('Bikepart', BikepartSchema);
