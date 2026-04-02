require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const pool = require('./database/pool');
const swaggerUi = require('swagger-ui-express');
const specs = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 8000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 1000, // maksimal 1000 request per windowMs
  message: {
    status: 'error',
    message: 'Terlalu banyak request dari IP yang sama.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// CORS configuration - untuk development dan production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://localhost:8000',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  // Vercel domains
  /.+\.vercel\.app$/
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log(`CORS blocked for origin: ${origin}`);
      // return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
      // Untuk development, lebih baik allow saja tapi beri warning
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Database connection test
pool.query('SELECT NOW()')
  .then(result => {
    console.log('Database berhasil terhubung:', result.rows[0].now);
  })
  .catch(err => {
    console.warn('Database connection failed:', err.message);
    console.log('Please create the database or check your configuration.');
  });

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Toko Pakaian API Documentation'
}));

// Routes - menggunakan prefix /api
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/products', require('./routes/products'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => {
  res.json({
    message: 'Toko Pakaian API - UKT Project',
    version: '1.0.0',
    author: 'Student Project',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`,
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      categories: '/api/categories',
      products: '/api/products',
      transactions: '/api/transactions'
    },
    status: 'running'
  });
});

app.get('/health', async (req, res) => {
  try {
    const dbCheck = await pool.query('SELECT 1');
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'Connected',
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: error.message
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nServer stopping...');
  await pool.end();
  process.exit(0);
});

// Export app for Vercel
module.exports = app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\nAPI Server started!`);
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`\nAvailable Endpoints:`);
    console.log(`    API Info:          http://localhost:${PORT}/`);
    console.log(`    Health Check:      http://localhost:${PORT}/health`);
    console.log(`    Swagger Docs:      http://localhost:${PORT}/api-docs`);
    console.log(`    Login Demo:        POST http://localhost:${PORT}/api/auth/login`);
    
    console.log(`\nQuick Links (Ctrl+Click to open):`);
    console.log(`   • Swagger UI: \x1b]8;;http://localhost:${PORT}/api-docs\x1b\\http://localhost:${PORT}/api-docs\x1b]8;;\x1b\\`);
    console.log(`   • Health Check: \x1b]8;;http://localhost:${PORT}/health\x1b\\http://localhost:${PORT}/health\x1b]8;;\x1b\\`);
    console.log(`   • API Info: \x1b]8;;http://localhost:${PORT}/\x1b\\http://localhost:${PORT}/\x1b]8;;\x1b\\`);
    
    console.log(`\nDemo Accounts:`);
    console.log(`   Admin: admin@demo.com / admin123`);
    console.log(`   Kasir: kasir@demo.com / kasir123`);
  });
}
