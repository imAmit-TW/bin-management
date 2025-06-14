const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});