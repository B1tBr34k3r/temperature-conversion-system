/**
 * Robust Client API & Offline Full-Stack Fallback Engine
 * Enables 100% standalone operation on static hosts (like GitHub Pages)
 * while seamlessly leveraging the Express REST API & SQLite DB when available.
 * Authors: Prakhar Harne & Naman Shrivastav
 */

class ConversionApiClient {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
    this.isServerConnected = false;
    this.localHistoryKey = 'tc800_local_history';
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

  async convert(value, fromScale, toScale, precision = '4') {
    try {
      if (this.isServerConnected) {
        const res = await fetch(`${this.baseUrl}/api/convert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value, fromScale, toScale, precision, saveToDb: true })
        });
        if (res.ok) {
          const data = await res.json();
          return data.data;
        }
      }
    } catch (err) {
      this.isServerConnected = false;
    }

    // Seamless Full Standalone Client Fallback (For GitHub Pages)
    return this.clientStandaloneConvert(value, fromScale, toScale, precision);
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

  // --- Client Standalone Mathematical Engine (For GitHub Pages) ---
  clientStandaloneConvert(value, fromScale, toScale, precision) {
    const val = Number(value);

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

    // Convert from Base Celsius to Target Scale
    let res = c;
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

    // Precision formatting
    const p = precision === 'raw' ? 4 : parseInt(precision, 10);
    const formatted = res.toFixed(isNaN(p) ? 4 : p);

    // All-Scale Telemetry
    const allScalesTelemetry = {
      C: { scale: 'C', name: 'Celsius', symbol: '°C', value: c.toFixed(p) },
      F: { scale: 'F', name: 'Fahrenheit', symbol: '°F', value: ((c * 9 / 5) + 32).toFixed(p) },
      K: { scale: 'K', name: 'Kelvin', symbol: 'K', value: (c + 273.15).toFixed(p) },
      R: { scale: 'R', name: 'Rankine', symbol: '°R', value: ((c + 273.15) * 1.8).toFixed(p) },
      De: { scale: 'De', name: 'Delisle', symbol: '°De', value: ((100 - c) * 1.5).toFixed(p) },
      N: { scale: 'N', name: 'Newton', symbol: '°N', value: (c * 0.33).toFixed(p) },
      Re: { scale: 'Re', name: 'Réaumur', symbol: '°Ré', value: (c * 0.8).toFixed(p) },
      Ro: { scale: 'Ro', name: 'Rømer', symbol: '°Rø', value: (c * 21 / 40 + 7.5).toFixed(p) }
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

    // Save to local storage history
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

window.apiClient = new ConversionApiClient();
