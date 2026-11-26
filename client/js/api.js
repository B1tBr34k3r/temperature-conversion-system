/**
 * Robust Client API & Offline Full-Stack Fallback Engine
 * Enables 100% standalone operation on static hosts (like GitHub Pages)
 * while seamlessly leveraging the Express REST API & SQLite DB when available.
 * Authors: Prakhar Harne & Naman Shrivastav
 */

const CLIENT_SCALE_BOUNDS = {
  C: { name: 'Celsius', symbol: '°C', absoluteZero: -273.15 },
  F: { name: 'Fahrenheit', symbol: '°F', absoluteZero: -459.67 },
  K: { name: 'Kelvin', symbol: 'K', absoluteZero: 0.0 },
  R: { name: 'Rankine', symbol: '°R', absoluteZero: 0.0 },
  De: { name: 'Delisle', symbol: '°De', absoluteZero: 559.725 },
  N: { name: 'Newton', symbol: '°N', absoluteZero: -90.1395 },
  Re: { name: 'Réaumur', symbol: '°Ré', absoluteZero: -218.52 },
  Ro: { name: 'Rømer', symbol: '°Rø', absoluteZero: -135.90375 }
};

class ConversionApiClient {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
    this.isServerConnected = false;
    this.localHistoryKey = 'tc800_local_history';
  }

  get isOfflineMode() {
    return !this.isServerConnected;
  }

  validateInput(rawInput, scale) {
    if (rawInput === undefined || rawInput === null) {
      throw new Error('Input cannot be null or undefined.');
    }

    const trimmed = String(rawInput).trim();
    if (trimmed === '') {
      throw new Error('Temperature input field cannot be empty.');
    }

    const numericRegex = /^[+-]?((\d+(\.\d*)?)|(\.\d+))([eE][+-]?\d+)?$/;
    if (!numericRegex.test(trimmed)) {
      throw new Error('Invalid character detected. Value must be a valid numerical constant.');
    }

    const val = Number(trimmed);
    if (!Number.isFinite(val)) {
      throw new Error('Value must resolve to a finite real number (NaN / Infinity rejected).');
    }

    const scaleMeta = CLIENT_SCALE_BOUNDS[scale];
    if (!scaleMeta) {
      throw new Error(`Unrecognized temperature scale: '${scale}'.`);
    }

    // Delisle runs inverted: cooling rises upward to +559.725 °De
    if (scale === 'De') {
      if (val > scaleMeta.absoluteZero + 1e-7) {
        throw new Error(`Thermodynamic Limit Violation: Temperature cannot drop below Absolute Zero (${scaleMeta.absoluteZero} ${scaleMeta.symbol}).`);
      }
    } else if (val < scaleMeta.absoluteZero - 1e-7) {
      throw new Error(`Thermodynamic Limit Violation: Temperature cannot drop below Absolute Zero (${scaleMeta.absoluteZero} ${scaleMeta.symbol}).`);
    }

    if (Math.abs(val) > 1e15) {
      throw new Error('Numerical value exceeds safe computational threshold (±10^15).');
    }

    return val;
  }

  async checkHealth() {
    try {
      const res = await fetch(`${this.baseUrl}/api/health`, { method: 'GET', cache: 'no-cache' });
      if (res.ok) {
        this.isServerConnected = true;
        return await res.json();
      }
    } catch (e) {
      this.isServerConnected = false;
    }
    return null;
  }

  async convert(value, fromScale, toScale, precision = '4', saveToDb = true) {
    if (this.isServerConnected) {
      let res;
      try {
        res = await fetch(`${this.baseUrl}/api/convert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value, fromScale, toScale, precision, saveToDb: Boolean(saveToDb) })
        });
      } catch (err) {
        // Network disconnect: degrade gracefully to standalone offline mode
        this.isServerConnected = false;
        res = null;
      }

      if (res) {
        if (res.ok) {
          const data = await res.json();
          return data.data;
        }
        // Propagate backend validation/HTTP errors directly instead of falling back
        if (res.status >= 400 && res.status < 500) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error || `Request rejected (HTTP ${res.status}).`);
        }
        this.isServerConnected = false;
      }
    }

    // Seamless Full Standalone Client Fallback (For GitHub Pages / Offline)
    return this.clientStandaloneConvert(value, fromScale, toScale, precision, Boolean(saveToDb));
  }

  async getHistory() {
    try {
      if (this.isServerConnected) {
        const res = await fetch(`${this.baseUrl}/api/history`, { cache: 'no-cache' });
        if (res.ok) {
          const json = await res.json();
          return json.history || [];
        }
      }
    } catch (e) {}

    // Fallback to localStorage on GitHub Pages
    return this.getLocalHistory();
  }

  async clearHistory() {
    try {
      if (this.isServerConnected) {
        const res = await fetch(`${this.baseUrl}/api/history`, { method: 'DELETE' });
        if (res.ok) return await res.json();
      }
    } catch (e) {}

    localStorage.removeItem(this.localHistoryKey);
    return { deleted: true };
  }

  formatStandalonePrecision(val, precision = '4') {
    if (precision === 'raw') return String(val);
    const places = parseInt(precision, 10);
    if (isNaN(places) || places < 0) return String(val);
    const factor = Math.pow(10, places);
    const rounded = Math.round((val + Number.EPSILON) * factor) / factor;
    return rounded.toFixed(places);
  }

  // --- Client Standalone Mathematical Engine (For GitHub Pages) ---
  clientStandaloneConvert(value, fromScale, toScale, precision = '4', saveToDb = true) {
    const val = this.validateInput(value, fromScale);
    if (!CLIENT_SCALE_BOUNDS[toScale]) {
      throw new Error(`Target scale '${toScale}' is invalid.`);
    }

    // Convert from source to Base Celsius
    let c = val;
    switch (fromScale) {
      case 'C': c = val; break;
      case 'F': c = (val - 32.0) * (5.0 / 9.0); break;
      case 'K': c = val - 273.15; break;
      case 'R': c = (val - 491.67) * (5.0 / 9.0); break;
      case 'De': c = 100.0 - (val * 2.0 / 3.0); break;
      case 'N': c = val * (100.0 / 33.0); break;
      case 'Re': c = val * 1.25; break;
      case 'Ro': c = (val - 7.5) * (40.0 / 21.0); break;
    }

    // Direct triad fast-paths + Celsius projection
    let res = c;
    if (fromScale === toScale) {
      res = val;
    } else if (fromScale === 'C' && toScale === 'F') {
      res = (val * 9.0 / 5.0) + 32.0;
    } else if (fromScale === 'F' && toScale === 'C') {
      res = (val - 32.0) * (5.0 / 9.0);
    } else if (fromScale === 'C' && toScale === 'K') {
      res = val + 273.15;
    } else if (fromScale === 'K' && toScale === 'C') {
      res = val - 273.15;
    } else if (fromScale === 'F' && toScale === 'K') {
      res = ((val - 32.0) * (5.0 / 9.0)) + 273.15;
    } else if (fromScale === 'K' && toScale === 'F') {
      res = ((val - 273.15) * 9.0 / 5.0) + 32.0;
    } else {
      switch (toScale) {
        case 'C': res = c; break;
        case 'F': res = (c * 9.0 / 5.0) + 32.0; break;
        case 'K': res = c + 273.15; break;
        case 'R': res = (c + 273.15) * (9.0 / 5.0); break;
        case 'De': res = (100.0 - c) * 1.5; break;
        case 'N': res = c * 0.33; break;
        case 'Re': res = c * 0.8; break;
        case 'Ro': res = (c * 21.0 / 40.0) + 7.5; break;
      }
    }

    // Precision formatting with IEEE 754 epsilon guard
    const formatted = this.formatStandalonePrecision(res, precision);

    // All-Scale Telemetry
    const allScalesTelemetry = {
      C: { scale: 'C', name: 'Celsius', symbol: '°C', value: this.formatStandalonePrecision(c, precision) },
      F: { scale: 'F', name: 'Fahrenheit', symbol: '°F', value: this.formatStandalonePrecision((c * 9 / 5) + 32, precision) },
      K: { scale: 'K', name: 'Kelvin', symbol: 'K', value: this.formatStandalonePrecision(c + 273.15, precision) },
      R: { scale: 'R', name: 'Rankine', symbol: '°R', value: this.formatStandalonePrecision((c + 273.15) * 1.8, precision) },
      De: { scale: 'De', name: 'Delisle', symbol: '°De', value: this.formatStandalonePrecision((100 - c) * 1.5, precision) },
      N: { scale: 'N', name: 'Newton', symbol: '°N', value: this.formatStandalonePrecision(c * 0.33, precision) },
      Re: { scale: 'Re', name: 'Réaumur', symbol: '°Ré', value: this.formatStandalonePrecision(c * 0.8, precision) },
      Ro: { scale: 'Ro', name: 'Rømer', symbol: '°Rø', value: this.formatStandalonePrecision(c * 21 / 40 + 7.5, precision) }
    };

    // Human-understandable step-by-step derivation
    const derivation = {
      formula: `${toScale} = ƒ(${fromScale})`,
      steps: [
        `1. Start with initial input: ${val} ${fromScale}`,
        `2. Normalized to Celsius standard: ${c.toFixed(4)} °C`,
        `3. Projected to target scale: ${formatted} ${toScale}`
      ]
    };

    if (fromScale === 'C' && toScale === 'F') {
      derivation.formula = '°F = (°C × 1.8) + 32';
      derivation.steps = [
        `1. Multiply input by 1.8 (9/5 ratio): ${val} × 1.8 = ${(val * 1.8).toFixed(4)}`,
        `2. Add 32 degree baseline shift: ${(val * 1.8).toFixed(4)} + 32 = ${res.toFixed(4)}`,
        `3. Final converted value: ${formatted} °F`
      ];
    } else if (fromScale === 'F' && toScale === 'C') {
      derivation.formula = '°C = (°F - 32) ÷ 1.8';
      derivation.steps = [
        `1. Subtract 32 baseline offset: ${val} - 32 = ${(val - 32).toFixed(4)}`,
        `2. Divide by 1.8 (or multiply by 5/9): ${(val - 32).toFixed(4)} ÷ 1.8 = ${res.toFixed(4)}`,
        `3. Final converted value: ${formatted} °C`
      ];
    }

    // Save to local storage history only when explicitly recording
    if (saveToDb) {
      this.saveLocalHistory({
        id: Date.now().toString().slice(-4),
        timestamp: new Date().toISOString(),
        inputValue: val,
        fromScale,
        resultValue: formatted,
        toScale,
        precisionSetting: precision,
        physicalState: c >= 100 ? 'Boiling Steam' : (c <= 0 ? 'Freezing Ice' : 'Comfortable Room')
      });
    }

    return {
      inputValue: val,
      fromScale,
      resultValue: formatted,
      rawResult: res,
      toScale,
      precision,
      derivation,
      physicalState: {
        label: c >= 100 ? 'Water Boiling Point / Steam' : (c <= 0 ? 'Sub-Zero Freezing' : 'Comfort Living Zone'),
        color: c >= 100 ? '#ef4444' : (c <= 0 ? '#38bdf8' : '#10b981')
      },
      allScalesTelemetry
    };
  }

  saveLocalHistory(item) {
    const list = this.getLocalHistory();
    list.unshift(item);
    const trimmed = list.slice(0, 30);
    try {
      localStorage.setItem(this.localHistoryKey, JSON.stringify(trimmed));
    } catch (e) {}
  }

  getLocalHistory() {
    try {
      const raw = localStorage.getItem(this.localHistoryKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  // Client-Side CSV & JSON Download for GitHub Pages
  downloadCSV() {
    const list = this.getLocalHistory();
    const headers = ['ID', 'Timestamp', 'InputValue', 'FromScale', 'ResultValue', 'ToScale', 'State'];
    const rows = list.map(r => [
      r.id,
      `"${r.timestamp}"`,
      r.inputValue,
      `"${r.fromScale}"`,
      r.resultValue,
      `"${r.toScale}"`,
      `"${r.physicalState || ''}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    this.triggerDownload(csvContent, 'temperature_conversions.csv', 'text/csv');
  }

  downloadJSON() {
    const list = this.getLocalHistory();
    this.triggerDownload(JSON.stringify(list, null, 2), 'temperature_conversions.json', 'application/json');
  }

  triggerDownload(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

if (typeof window !== 'undefined') {
  window.apiClient = new ConversionApiClient();
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ConversionApiClient, CLIENT_SCALE_BOUNDS };
}
