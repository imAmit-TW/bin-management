const express = require('express');
const InventoryBin = require('../models/InventoryBin');
const Agency = require('../models/Agency');
const SalesRep = require('../models/SalesRep');

const router = express.Router();

// GET /api/inventory/bins (with population)
router.get('/bins', async (req, res) => {
  try {
    const bins = await InventoryBin.find()
      .populate('owners', 'name')
      .populate('sharers', 'name')
      .populate('withdrawalLimits.agency', 'name');
    res.json(bins);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/inventory/bins/:id/add
router.post('/bins/:id/add', async (req, res) => {
  try {
    const { quantity, agencyId, srId } = req.body;
    const bin = await InventoryBin.findById(req.params.id);
    if (!bin) return res.status(404).json({ error: 'Bin not found' });
    bin.currentStock += quantity;
    bin.lastUpdated = new Date();
    bin.history.push({ type: 'add', agency: agencyId, sr: srId, quantity, date: new Date() });
    await bin.save();
    res.json(bin);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/inventory/bins/:id/withdraw
router.post('/bins/:id/withdraw', async (req, res) => {
  try {
    const { quantity, agencyId, srId } = req.body;
    const bin = await InventoryBin.findById(req.params.id);
    if (!bin) return res.status(404).json({ error: 'Bin not found' });
    // Find withdrawal limit for this agency (if any)
    const limitObj = bin.withdrawalLimits.find(wl => wl.agency.toString() === agencyId);
    if (limitObj && quantity > limitObj.limit) {
      return res.status(400).json({ error: 'Withdrawal exceeds agency limit' });
    }
    if (quantity > bin.currentStock) {
      return res.status(400).json({ error: 'Not enough stock' });
    }
    bin.currentStock -= quantity;
    bin.lastUpdated = new Date();
    bin.history.push({ type: 'withdraw', agency: agencyId, sr: srId, quantity, date: new Date() });
    await bin.save();
    res.json(bin);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/inventory/bins/:id/history
router.get('/bins/:id/history', async (req, res) => {
  try {
    const bin = await InventoryBin.findById(req.params.id)
      .populate('history.agency', 'name')
      .populate('history.sr', 'name');
    if (!bin) return res.status(404).json({ error: 'Bin not found' });
    res.json(bin.history);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/inventory/aggregate
router.get('/aggregate', async (req, res) => {
  try {
    // Aggregate inventory by agency
    const bins = await InventoryBin.find()
      .populate('owners', 'name')
      .populate('sharers', 'name');
    const agencyInventory = {};
    bins.forEach(bin => {
      [...bin.owners, ...bin.sharers].forEach(agency => {
        if (!agencyInventory[agency._id]) {
          agencyInventory[agency._id] = { agency: agency.name, total: 0, bins: [] };
        }
        agencyInventory[agency._id].total += bin.currentStock;
        agencyInventory[agency._id].bins.push({ bin: bin.name, stock: bin.currentStock });
      });
    });
    res.json(Object.values(agencyInventory));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 