const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
// Load .env file (only used locally - Render uses dashboard env vars)
require('dotenv').config();

// Debug: Check which env vars are set (without revealing values)
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is NOT set! Environment variables:');
  console.error('   MONGO_URI:', process.env.MONGO_URI ? '✓ Set' : '✗ MISSING');
  console.error('   JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ MISSING');
  console.error('   NODE_ENV:', process.env.NODE_ENV || 'not set');
  console.error('');
  console.error('⚠️  If running on Render: Add MONGO_URI in Dashboard > Environment Variables');
  console.error('⚠️  If running locally: Create server/.env file from server/.env.example');
}

const connectDB = require('./config/db');
const { startKeepAliveCron } = require('./services/cronService');
const { errorHandler } = require('./utils/AppError');

// Import routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');

const app = express();

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
// CORS - allow localhost dev, Vercel frontend, and Render backend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://smarthire-frontend.vercel.app',
  'https://smarthire-backend-7wkj.onrender.com',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.some(o => origin.startsWith(o) || o.startsWith(origin))) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in production for now
    }
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SmartHire API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Connect to database and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`SmartHire Server running on port ${PORT}`);
    // Start cron jobs after server is up
    startKeepAliveCron();
  });
}).catch(err => {
  console.error('Failed to connect to database:', err.message);
  process.exit(1);
});

module.exports = app;
