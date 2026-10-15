/**
 * Database Module (SQLite via Node.js Native SQLite Engine)
 * Milestone 3: Database Implementation
 * Authors: Prakhar Harne & Naman Shrivastav
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'conversions.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode & foreign keys for high performance and durability
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA synchronous = NORMAL;');

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS conversions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    input_value REAL NOT NULL,
    from_scale TEXT NOT NULL,
    result_value REAL NOT NULL,
    to_scale TEXT NOT NULL,
    precision_setting TEXT NOT NULL DEFAULT '4',
    formula TEXT NOT NULL,
    physical_state TEXT,
    client_ip TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_conversions_timestamp ON conversions(timestamp DESC);
  CREATE INDEX IF NOT EXISTS idx_conversions_scales ON conversions(from_scale, to_scale);
`);

/**
 * Insert a new conversion record
 */
function insertConversion({ inputValue, fromScale, resultValue, toScale, precision, formula, physicalState, clientIp }) {
  const stmt = db.prepare(`
    INSERT INTO conversions (input_value, from_scale, result_value, to_scale, precision_setting, formula, physical_state, client_ip)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    Number(inputValue),
    String(fromScale),
    Number(resultValue),
    String(toScale),
    String(precision || '4'),
    String(formula || ''),
    String(physicalState || 'Normal'),
    String(clientIp || '127.0.0.1')
  );
  return {
    id: result.lastInsertRowid,
    changes: result.changes
  };
}

/**
 * Fetch latest conversion records
 */
function getConversions(limit = 50, offset = 0) {
  const stmt = db.prepare(`
    SELECT 
      id,
      input_value AS inputValue,
      from_scale AS fromScale,
      result_value AS resultValue,
      to_scale AS toScale,
      precision_setting AS precisionSetting,
      formula,
      physical_state AS physicalState,
      timestamp
    FROM conversions
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `);
  return stmt.all(Number(limit), Number(offset));
}

/**
 * Clear all records
 */
function clearConversions() {
  const stmt = db.prepare('DELETE FROM conversions');
  const result = stmt.run();
  db.exec('VACUUM;');
  return { deleted: result.changes };
}

/**
 * Fetch database analytics & statistics
 */
function getStatistics() {
  const countRow = db.prepare('SELECT COUNT(*) as total FROM conversions').get();
  const popularScaleRow = db.prepare(`
    SELECT from_scale, COUNT(*) as freq 
    FROM conversions 
    GROUP BY from_scale 
    ORDER BY freq DESC 
    LIMIT 1
  `).get();
  const minMaxRow = db.prepare(`
    SELECT MIN(input_value) as minInput, MAX(input_value) as maxInput 
    FROM conversions
  `).get();

  return {
    totalConversions: countRow ? countRow.total : 0,
    mostFrequentInputScale: popularScaleRow ? popularScaleRow.from_scale : 'N/A',
    minInputRecorded: minMaxRow && minMaxRow.minInput !== null ? minMaxRow.minInput : 0,
    maxInputRecorded: minMaxRow && minMaxRow.maxInput !== null ? minMaxRow.maxInput : 0
  };
}

module.exports = {
  db,
  insertConversion,
  getConversions,
  clearConversions,
  getStatistics
};
