const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/inventory-management';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routers
const agenciesRouter = require('./routes/agencies');
const salesRepsRouter = require('./routes/salesReps');
const dashboardRouter = require('./routes/dashboard');
const inventoryRouter = require('./routes/inventory');

// Use routers
app.use('/api/agencies', agenciesRouter);
app.use('/api/sales-reps', salesRepsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/inventory', inventoryRouter);

const InventoryBin = require('./models/InventoryBin');
const Agency = require('./models/Agency');

// One-time bin seeding function
const seedBins = async () => {
  const agencies = await Agency.find();
  if (agencies.length < 2) {
    console.log('Seed at least 2 agencies first!');
    return;
  }
  await InventoryBin.deleteMany({});
  await InventoryBin.insertMany([
    {
      binId: 'BIN-001',
      name: 'Premium Wheat Seeds',
      capacity: 1000,
      currentStock: 850,
      seedType: 'Wheat',
      lastUpdated: new Date(),
      owners: [agencies[0]._id],
      sharers: [agencies[1]._id],
      withdrawalLimits: [
        { agency: agencies[0]._id, limit: 600 },
        { agency: agencies[1]._id, limit: 400 }
      ],
      history: []
    },
    {
      binId: 'BIN-002',
      name: 'Organic Corn Seeds',
      capacity: 800,
      currentStock: 200,
      seedType: 'Corn',
      lastUpdated: new Date(),
      owners: [agencies[1]._id],
      sharers: [agencies[0]._id],
      withdrawalLimits: [
        { agency: agencies[1]._id, limit: 500 },
        { agency: agencies[0]._id, limit: 300 }
      ],
      history: []
    }
  ]);
  console.log('Bins seeded with owners, sharers, and limits!');
};
//seedBins(); // <-- Comment this out after running once

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 