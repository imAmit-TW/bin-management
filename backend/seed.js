// backend/seed.js
const mongoose = require('mongoose');
require('dotenv').config();

const Agency = require('./models/Agency');
const InventoryBin = require('./models/InventoryBin');
const Dashboard = require('./models/Dashboard');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/inventory-management';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Agency.deleteMany({});
  await InventoryBin.deleteMany({});
  await Dashboard.deleteMany({});

  // Create 4 agencies
  const agencies = await Agency.insertMany([
    { name: 'Franklin Sisters Inc', allocation: 1200, lastUpdated: new Date(), contactPerson: 'Alice', email: 'alice@franklin.com', phone: '1234567890', address: '123 Main St', status: 'active', createdAt: new Date() },
    { name: 'Wyckoff Agency', allocation: 900, lastUpdated: new Date(), contactPerson: 'Bob', email: 'bob@wyckoff.com', phone: '2345678901', address: '456 Oak Ave', status: 'active', createdAt: new Date() },
    { name: 'Green Valley Seeds', allocation: 800, lastUpdated: new Date(), contactPerson: 'Carol', email: 'carol@greenvalley.com', phone: '3456789012', address: '789 Pine Rd', status: 'active', createdAt: new Date() },
    { name: 'Harvest Partners', allocation: 700, lastUpdated: new Date(), contactPerson: 'Dave', email: 'dave@harvest.com', phone: '4567890123', address: '321 Maple St', status: 'active', createdAt: new Date() }
  ]);

  // Create 4 bins with unique binId
  const bins = [
    {
      binId: 'BIN-001',
      name: 'Bin 1',
      capacity: 1000,
      currentStock: 800,
      seedType: 'P00622Q',
      lastUpdated: new Date(),
      owners: [agencies[0]._id],
      sharers: [agencies[1]._id],
      withdrawalLimits: [
        { agency: agencies[0]._id, limit: 700 },
        { agency: agencies[1]._id, limit: 300 }
      ],
      history: []
    },
    {
      binId: 'BIN-002',
      name: 'Bin 2',
      capacity: 1200,
      currentStock: 1100,
      seedType: 'P00123Q',
      lastUpdated: new Date(),
      owners: [agencies[2]._id],
      sharers: [agencies[3]._id],
      withdrawalLimits: [
        { agency: agencies[2]._id, limit: 900 },
        { agency: agencies[3]._id, limit: 300 }
      ],
      history: []
    },
    {
      binId: 'BIN-003',
      name: 'Bin 3',
      capacity: 900,
      currentStock: 500,
      seedType: 'P00999A',
      lastUpdated: new Date(),
      owners: [agencies[0]._id],
      sharers: [agencies[2]._id],
      withdrawalLimits: [
        { agency: agencies[0]._id, limit: 600 },
        { agency: agencies[2]._id, limit: 300 }
      ],
      history: []
    },
    {
      binId: 'BIN-004',
      name: 'Bin 4',
      capacity: 1500,
      currentStock: 1200,
      seedType: 'P00888B',
      lastUpdated: new Date(),
      owners: [agencies[1]._id],
      sharers: [agencies[3]._id],
      withdrawalLimits: [
        { agency: agencies[1]._id, limit: 1000 },
        { agency: agencies[3]._id, limit: 500 }
      ],
      history: []
    }
  ];

  await InventoryBin.insertMany(bins);

  // Calculate dashboard data
  const totalCapacity = bins.reduce((sum, b) => sum + b.capacity, 0);
  const currentUsage = bins.reduce((sum, b) => sum + b.currentStock, 0);
  const agencyData = agencies.map(a => ({
    name: a.name,
    allocation: a.allocation,
    lastUpdated: a.lastUpdated
  }));

  console.log('Dashboard data to be inserted:', {
    totalCapacity,
    currentUsage,
    agencies: agencyData
  });

  // Seed dashboard data
  const dashboardData = await Dashboard.create({
    totalCapacity,
    currentUsage,
    agencies: agencyData
  });

  console.log('Created dashboard document:', dashboardData);

  // Verify dashboard data was created
  const verifyDashboard = await Dashboard.find();
  console.log('Dashboard documents in database:', verifyDashboard);

  console.log('Seeded 4 agencies, 4 bins, and dashboard data!');
  await mongoose.disconnect();
}

seed().catch(console.error);