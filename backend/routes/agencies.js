const express = require('express');
const Agency = require('../models/Agency');

const router = express.Router();

// GET /api/agencies
router.get('/', async (req, res) => {
  try {
    const agencies = await Agency.find();
    res.json(agencies);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 