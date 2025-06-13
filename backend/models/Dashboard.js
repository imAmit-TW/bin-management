const mongoose = require('mongoose');

const AgencySchema = new mongoose.Schema({
  name: String,
  allocation: Number,
  lastUpdated: Date,
});

const DashboardSchema = new mongoose.Schema({
  totalCapacity: Number,
  currentUsage: Number,
  agencies: [AgencySchema],
});

module.exports = mongoose.model('Dashboard', DashboardSchema); 