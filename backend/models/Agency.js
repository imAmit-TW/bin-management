const mongoose = require('mongoose');

const AgencySchema = new mongoose.Schema({
  name: String,
  allocation: Number,
  lastUpdated: Date,
  contactPerson: String,
  email: String,
  phone: String,
  address: String,
  status: String,
  createdAt: Date,
});

module.exports = mongoose.model('Agency', AgencySchema); 