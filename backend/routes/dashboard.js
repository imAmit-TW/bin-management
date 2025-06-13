const express = require('express');
const Dashboard = require('../models/Dashboard');

const router = express.Router();

// GET /api/dashboard
router.get('/', async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne().sort({ _id: -1 });
    if (!dashboard) return res.status(404).json({ error: 'No dashboard data found' });
    res.json(dashboard);
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 