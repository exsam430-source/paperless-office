require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIO = require('socket.io');
const connectDB = require('./config/db');
const { testConnection } = require('./services/aiService'); // ADD THIS
const { apiLimiter } = require('./middleware/rateLimiter');
const { initSocket } = require('./services/socketService');
const initCronJobs = require('./cron');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const workflowRoutes = require('./routes/workflowRoutes');
const fileRoutes = require('./routes/fileRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const auditRoutes = require('./routes/auditRoutes');
const aiRoutes = require('./routes/aiRoutes'); // ADD THIS
const testRoutes = require('./routes/testRoutes'); // ADD

// Initialize Express App
const app = express();

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Connect to Database
connectDB();
// Test AI Service Connection (ADD THIS)
setTimeout(async () => {
  console.log('🤖 Testing AI Service connection...');
  await testConnection();
}, 2000);

// Initialize Socket Service
initSocket(io);

// Initialize Cron Jobs
initCronJobs();

// Middleware
// Middleware
app.use(helmet({
  // ✅ Allow cross-origin resources
  crossOriginResourcePolicy: { policy: "cross-origin" }, 
  // ✅ Allow iframes for PDFs from same origin
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      frameAncestors: ["'self'"], // Allow embedding from same origin
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"], // Allow iframes from same origin
    },
  },
  // ✅ Remove X-Frame-Options for same-origin embedding
  frameguard: false, // We'll handle this manually below
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // ✅ Add OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'], // ✅ Explicitly allow headers
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // ✅ Cache preflight for 24 hours
}));

// ✅ Increase payload limits for signatures (base64 images can be large)
app.use(express.json({ limit: '50mb' })); // Increased from 8mb
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate Limiting
app.use('/api/', apiLimiter);
// Handle preflight requests explicitly
// app.options('*', cors());

// // API Routes (add your routes after this)
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// ... rest of routes

// Static Files (Uploads)
// Static Files (Uploads) - with cache control for PDFs
app.use('/uploads', (req, res, next) => {
  // Allow CORS for images
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.path.toLowerCase().endsWith('.pdf')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
}, express.static('uploads'));

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Paperless Office API is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/ai', aiRoutes); // ADD THIS
app.use('/api/test', testRoutes); // ADD

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📄 PAPERLESS OFFICE SYSTEM - BACKEND');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🔌 Socket.io: http://localhost:${PORT}`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  server.close(() => process.exit(1));
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

module.exports = { app, server, io };