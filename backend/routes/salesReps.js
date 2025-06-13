const express = require('express');
const SalesRep = require('../models/SalesRep');

const router = express.Router();

// GET /api/sales-reps
router.get('/', async (req, res) => {
  try {
    const srs = await SalesRep.find();
    res.json(srs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 