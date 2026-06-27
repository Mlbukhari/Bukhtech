const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./api/auth');
const paymentsRoutes = require('./api/payments');
const vendorsRoutes = require('./api/vendors');

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: [process.env.VERCEL_URL, 'http://localhost:3000'],
  credentials: true,
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/vendors', vendorsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    piEnvironment: process.env.REACT_APP_PI_ENVIRONMENT || 'testnet',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
  });
});

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Pi Environment: ${process.env.REACT_APP_PI_ENVIRONMENT || 'testnet'}`);
  });
}

module.exports = app;
