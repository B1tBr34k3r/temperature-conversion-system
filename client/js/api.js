/**
 * API Client with Local Resiliency Fallback
 * Milestone 3: Front-End and Back-End Integration
 */

class ConversionApiClient {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
    this.isServerConnected = false;
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
      const res = await fetch(`${this.baseUrl}/api/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, fromScale, toScale, precision, saveToDb: true })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server validation error.');
      }
      this.isServerConnected = true;
      return data.data;
    } catch (err) {
      console.warn('Backend REST request failed or offline. Switching to client fallback:', err.message);
      this.isServerConnected = false;
      return this.localFallbackConvert(value, fromScale, toScale, precision);
    }
  }

  async getHistory() {
    try {
      const res = await fetch(`${this.baseUrl}/api/history`, { cache: 'no-cache' });
      if (res.ok) {
        const json = await res.json();
        return json.history || [];
      }
    } catch (e) {
      console.warn('Failed to load DB history from server:', e);
    }
    return [];
  }

  async clearHistory() {
    try {
      const res = await fetch(`${this.baseUrl}/api/history`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Failed to clear DB history on server:', e);
    }
    return null;
  }

  async getStats() {
    try {
      const res = await fetch(`${this.baseUrl}/api/stats`, { cache: 'no-cache' });
      if (res.ok) {
        const json = await res.json();
        return json.stats;
      }
    } catch (e) {}
    return null;
  }

  // Local fallback engine in case backend server is disconnected
  localFallbackConvert(value, fromScale, toScale, precision) {
    const val = Number(value);
    // Simple conversion logic for core triad
    let c = val;
    if (fromScale === 'F') c = (val - 32) * 5 / 9;
    else if (fromScale === 'K') c = val - 273.15;

    let res = c;
    if (toScale === 'F') res = (c * 9 / 5) + 32;
    else if (toScale === 'K') res = c + 273.15;

    const p = parseInt(precision, 10);
    const formatted = isNaN(p) ? res : res.toFixed(p);

    return {
      inputValue: val,
      fromScale,
      resultValue: formatted,
      rawResult: res,
      toScale,
      precision,
      derivation: {
        formula: `${toScale} = ƒ(${fromScale})`,
        steps: [`Computed via client offline fallback mode`]
      },
      physicalState: { label: 'Active (Offline Fallback)', tier: 'ambient', color: '#10b981' },
      allScalesTelemetry: {},
      isFallback: true
    };
  }
}

window.apiClient = new ConversionApiClient();
