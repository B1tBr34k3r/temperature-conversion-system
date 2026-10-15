/**
 * Temperature Conversion System - Server Main Entry
 * Milestone 3: Full-Stack Integration & Working Software System
 * Authors: Prakhar Harne & Naman Shrivastav
 */

const express = require('express');
const cors = require('cors');
const path = require('node:path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets from client/
const clientPath = path.join(__dirname, '..', 'client');
app.use(express.static(clientPath));

// Mount REST API routes
app.use('/api', apiRoutes);

// Fallback to client SPA for non-API routes
app.use((req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Start Server
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log('========================================================');
    console.log(`⚡ TEMPERATURE CONVERSION SYSTEM (MILESTONE 3 ACTIVE)`);
    console.log(`🌐 Server running at: http://localhost:${PORT}`);
    console.log(`📡 REST API endpoint: http://localhost:${PORT}/api/convert`);
    console.log(`💾 Database: SQLite3 WAL Mode initialized in server/data/`);
    console.log('========================================================');
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Shutting down gracefully...');
    server.close(() => process.exit(0));
  });
}

module.exports = app;
