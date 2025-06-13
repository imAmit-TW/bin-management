const mongoose = require('mongoose');

const SalesRepSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  agencyId: mongoose.Schema.Types.ObjectId,
  withdrawalLimit: Number,
  plan: String,
  status: String,
  createdAt: Date,
});

module.exports = mongoose.model('SalesRep', SalesRepSchema); 