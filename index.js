const express = require('express');
const app = express();
const employeesRouter = require('./src/routes/employees');
const errorHandler = require('./src/middleware/errorHandler');
const prisma = require('./src/config/database');

// Middleware
app.use(express.json());

// Routes
app.use('/employees', employeesRouter);

// Health check endpoint
app.get('/health', (req, res) => res.json({ ok: true }));

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server ONLY if not running tests
if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  const server = app.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}`);
    try {
      await prisma.$connect();
      console.log('Connected to DB');
    } catch (e) {
      console.error('Database connection error:', e);
      process.exit(1);
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Error: Port ${port} is already in use.`);
      console.error(`Please either:`);
      console.error(`  1. Stop the process using port ${port}`);
      console.error(`  2. Use a different port by setting PORT environment variable (e.g., PORT=3001)`);
      console.error(`\nTo find and kill the process: lsof -ti:${port} | xargs kill -9\n`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

module.exports = app;
