/**
 * History & Analytics Service
 * Milestone 3: Database Implementation & Integration
 * Authors: Prakhar Harne & Naman Shrivastav
 */

const { insertConversion, getConversions, clearConversions, getStatistics } = require('../config/db');

class HistoryService {
  static recordConversion({ inputValue, fromScale, resultValue, toScale, precision, formula, physicalState, clientIp }) {
    return insertConversion({
      inputValue,
      fromScale,
      resultValue,
      toScale,
      precision,
      formula,
      physicalState,
      clientIp
    });
  }

  static fetchRecent(limit = 50, offset = 0) {
    return getConversions(limit, offset);
  }

  static purge() {
    return clearConversions();
  }

  static getTelemetry() {
    return getStatistics();
  }

  static exportAsCSV() {
    const records = getConversions(1000, 0);
    const headers = ['ID', 'Timestamp', 'InputValue', 'FromScale', 'ResultValue', 'ToScale', 'Precision', 'PhysicalState', 'Formula'];
    const rows = records.map(r => [
      r.id,
      `"${r.timestamp}"`,
      r.inputValue,
      `"${r.fromScale}"`,
      r.resultValue,
      `"${r.toScale}"`,
      `"${r.precisionSetting}"`,
      `"${r.physicalState || ''}"`,
      `"${(r.formula || '').replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  static exportAsJSON() {
    const records = getConversions(1000, 0);
    return JSON.stringify(records, null, 2);
  }
}

module.exports = {
  HistoryService
};
