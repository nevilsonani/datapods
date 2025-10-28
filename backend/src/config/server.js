const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { connectDB } = require('./db');
const errorHandler = require('../middleware/errorHandler');

// Import routes
const authRoutes = require('../routes/auth');
const vaultRoutes = require('../routes/vaults');

const app = express();

// Connect to MongoDB
connectDB();

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set static folder
app.use(express.static(path.join(__dirname, '../public')));

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vaults', vaultRoutes);

// Error handling middleware
app.use(errorHandler);

// Handle 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
  });});

module.exports = app;
