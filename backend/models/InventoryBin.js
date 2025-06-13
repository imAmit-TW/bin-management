const mongoose = require('mongoose');

const InventoryBinSchema = new mongoose.Schema({
  binId: { type: String, unique: true },
  name: String,
  capacity: Number,
  currentStock: Number,
  seedType: String,
  lastUpdated: Date,
  owners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agency' }], // primary owners
  sharers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agency' }], // agencies sharing the bin
  withdrawalLimits: [{
    agency: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency' },
    limit: Number
  }],
  history: [{
    type: { type: String, enum: ['add', 'withdraw', 'transfer'] },
    agency: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency' },
    sr: { type: mongoose.Schema.Types.ObjectId, ref: 'SalesRep' },
    quantity: Number,
    date: Date
  }]
});

module.exports = mongoose.model('InventoryBin', InventoryBinSchema); 