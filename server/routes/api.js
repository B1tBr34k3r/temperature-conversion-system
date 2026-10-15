/**
 * REST API Routes
 * Milestone 3: Front-End and Back-End Integration
 * Authors: Prakhar Harne & Naman Shrivastav
 */

const express = require('express');
const router = express.Router();
const { SCALES, ConversionService } = require('../services/conversionService');
const { ValidationService } = require('../services/validationService');
const { HistoryService } = require('../services/historyService');

// GET /api/scales - List metadata for all 8 supported temperature scales
router.get('/scales', (req, res) => {
  res.json({
    success: true,
    scales: SCALES
  });
});

// POST /api/convert - Perform high-precision conversion with physical analysis & DB logging
router.post('/convert', (req, res) => {
  try {
    const { value, fromScale = 'C', toScale = 'F', precision = '4', saveToDb = true } = req.body;

    // Validate Input
    const validation = ValidationService.validate(value, fromScale);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    if (!SCALES[toScale]) {
      return res.status(400).json({
        success: false,
        error: `Target scale '${toScale}' is invalid.`
      });
    }

    const numericInput = validation.value;
    const rawResult = ConversionService.convert(numericInput, fromScale, toScale);
    const formattedResult = ConversionService.formatPrecision(rawResult, precision);

    // Step-by-step formula derivation
    const derivation = ConversionService.getFormulaBreakdown(numericInput, fromScale, toScale, rawResult, formattedResult);

    // Thermal milestone classification (using base Celsius equivalent)
    const baseCelsius = ConversionService.toCelsius(numericInput, fromScale);
    const physicalState = ConversionService.getPhysicalState(baseCelsius);

    // Full 8-scale telemetry radar projection
    const allScalesTelemetry = ConversionService.convertToAllScales(numericInput, fromScale, precision);

    // Persist into SQLite Database if requested
    let dbRecordId = null;
    if (saveToDb) {
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const insertRes = HistoryService.recordConversion({
        inputValue: numericInput,
        fromScale,
        resultValue: rawResult,
        toScale,
        precision,
        formula: derivation.formula,
        physicalState: physicalState.label,
        clientIp
      });
      dbRecordId = insertRes.id;
    }

    res.json({
      success: true,
      data: {
        inputValue: numericInput,
        fromScale,
        resultValue: formattedResult,
        rawResult,
        toScale,
        precision,
        derivation,
        physicalState,
        allScalesTelemetry,
        dbRecordId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('API Conversion Error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal calculation anomaly: ' + err.message
    });
  }
});

// GET /api/history - Retrieve recent conversion logs from SQLite database
router.get('/history', (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
    const offset = Math.max(parseInt(req.query.offset || '0', 10), 0);
    const history = HistoryService.fetchRecent(limit, offset);
    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve database logs: ' + err.message
    });
  }
});

// DELETE /api/history - Purge SQLite conversion records
router.delete('/history', (req, res) => {
  try {
    const result = HistoryService.purge();
    res.json({
      success: true,
      message: 'Conversion records purged successfully.',
      deletedCount: result.deleted
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to purge database records: ' + err.message
    });
  }
});

// GET /api/stats - Retrieve database analytics
router.get('/stats', (req, res) => {
  try {
    const stats = HistoryService.getTelemetry();
    res.json({
      success: true,
      stats
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics: ' + err.message
    });
  }
});

// GET /api/export/csv - Download conversion history as CSV
router.get('/export/csv', (req, res) => {
  try {
    const csvData = HistoryService.exportAsCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="temperature_conversions.csv"');
    res.send(csvData);
  } catch (err) {
    res.status(500).send('Error generating CSV export.');
  }
});

// GET /api/export/json - Download conversion history as JSON
router.get('/export/json', (req, res) => {
  try {
    const jsonData = HistoryService.exportAsJSON();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="temperature_conversions.json"');
    res.send(jsonData);
  } catch (err) {
    res.status(500).send('Error generating JSON export.');
  }
});

// GET /api/health - System diagnostic healthcheck
router.get('/health', (req, res) => {
  res.json({
    status: 'OPTIMAL',
    system: 'Temperature Conversion System (M3 Engine)',
    uptimeSeconds: Math.floor(process.uptime()),
    database: 'SQLite 3 (WAL mode active)',
    engine: 'IEEE 754 Stabilized Multi-Scale Core',
    supportedScales: Object.keys(SCALES).length,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
