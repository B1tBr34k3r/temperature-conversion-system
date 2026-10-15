/**
 * Futuristic Cyber-HUD Master Controller
 * Milestone 3: Full-Stack Integration
 * Authors: Prakhar Harne & Naman Shrivastav
 */

document.addEventListener('DOMContentLoaded', async () => {
  // DOM Elements
  const tempInput = document.getElementById('tempInput');
  const fromScale = document.getElementById('fromScale');
  const toScale = document.getElementById('toScale');
  const swapBtn = document.getElementById('swapBtn');
  const convertBtn = document.getElementById('convertBtn');
  const precisionSelect = document.getElementById('precisionSelect');
  const copyBtn = document.getElementById('copyBtn');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const crtToggleBtn = document.getElementById('crtToggleBtn');

  // Outputs
  const resultDisplay = document.getElementById('resultDisplay');
  const resultUnit = document.getElementById('resultUnit');
  const errorAlert = document.getElementById('errorAlert');
  const serverStatusBadge = document.getElementById('serverStatusBadge');
  const formulaEquation = document.getElementById('formulaEquation');
  const formulaTerminal = document.getElementById('formulaTerminal');
  const telemetryGrid = document.getElementById('telemetryGrid');
  const historyTbody = document.getElementById('historyTbody');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const exportJsonBtn = document.getElementById('exportJsonBtn');

  // Initialize Canvas Particle Reactor & Gauge
  const particleReactor = new ThermalParticleReactor('thermalCanvas');
  const gauge = new HolographicGauge('holographicGaugeSvg');

  // Check Backend Server Health
  const health = await window.apiClient.checkHealth();
  updateServerStatus(health);

  // Load Initial Database History & Telemetry
  refreshHistory();

  // --- Event Listeners ---

  // Input conversion (debounce)
  let debounceTimer;
  tempInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => executeConversion(false), 220);
  });

  fromScale.addEventListener('change', () => {
    window.hudAudio.playBeep(700, 0.05);
    executeConversion(false);
  });

  toScale.addEventListener('change', () => {
    window.hudAudio.playBeep(700, 0.05);
    executeConversion(false);
  });

  precisionSelect.addEventListener('change', () => {
    window.hudAudio.playBeep(600, 0.05);
    executeConversion(false);
  });

  // Scale Swap
  swapBtn.addEventListener('click', () => {
    const temp = fromScale.value;
    fromScale.value = toScale.value;
    toScale.value = temp;
    window.hudAudio.playSwap();
    swapBtn.classList.add('rotating');
    setTimeout(() => swapBtn.classList.remove('rotating'), 350);
    executeConversion(false);
  });

  // Action Button Convert
  convertBtn.addEventListener('click', () => {
    executeConversion(true);
  });

  // Preset Chips
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-val');
      const scale = btn.getAttribute('data-scale');
      tempInput.value = val;
      fromScale.value = scale;
      window.hudAudio.playBeep(900, 0.08);
      executeConversion(true);
    });
  });

  // Sound Toggle
  soundToggleBtn.addEventListener('click', () => {
    const isEnabled = window.hudAudio.toggleSound();
    soundToggleBtn.classList.toggle('active', isEnabled);
    soundToggleBtn.querySelector('.toggle-label').textContent = isEnabled ? 'AUDIO: ON' : 'AUDIO: MUTED';
  });

  // CRT Scanline Toggle
  crtToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('crt-active');
    crtToggleBtn.classList.toggle('active');
    window.hudAudio.playBeep(500, 0.05);
  });

  // Clipboard Copy
  copyBtn.addEventListener('click', () => {
    const text = resultDisplay.textContent;
    const unit = resultUnit.textContent;
    if (text === '--' || text === 'ERR') return;

    navigator.clipboard.writeText(`${text} ${unit}`).then(() => {
      window.hudAudio.playBeep(1200, 0.1);
      const span = copyBtn.querySelector('span');
      span.textContent = 'COPIED!';
      setTimeout(() => span.textContent = 'COPY', 1500);
    });
  });

  // History & Export
  clearHistoryBtn.addEventListener('click', async () => {
    window.hudAudio.playBeep(300, 0.12, 'square');
    if (confirm('Purge all historical records from SQLite database?')) {
      await window.apiClient.clearHistory();
      refreshHistory();
    }
  });

  exportCsvBtn.addEventListener('click', () => {
    window.hudAudio.playBeep(800, 0.08);
    window.location.href = '/api/export/csv';
  });

  exportJsonBtn.addEventListener('click', () => {
    window.hudAudio.playBeep(800, 0.08);
    window.location.href = '/api/export/json';
  });

  // --- Core Conversion Routine ---
  async function executeConversion(isExplicit = false) {
    const rawVal = tempInput.value.trim();
    if (rawVal === '') {
      clearOutputs();
      return;
    }

    try {
      const data = await window.apiClient.convert(
        rawVal,
        fromScale.value,
        toScale.value,
        precisionSelect.value
      );

      // Successful Conversion
      errorAlert.textContent = '';
      errorAlert.classList.remove('active');
      tempInput.classList.remove('input-invalid');

      resultDisplay.textContent = data.resultValue;
      resultUnit.textContent = getUnitSymbol(data.toScale);

      // Play Sound
      if (isExplicit) window.hudAudio.playConvert();

      // Update Particle Simulation speed and color based on Celsius base
      const baseC = data.rawResult ? getCelsiusEquivalent(data.inputValue, data.fromScale) : 25;
      particleReactor.setTemperature(baseC);

      // Update Holographic Radial Gauge
      gauge.update(baseC, data.resultValue, getUnitSymbol(data.toScale), data.physicalState);

      // Update Step-by-Step Derivation Terminal
      renderDerivation(data.derivation);

      // Update Full Multi-Scale Telemetry Deck
      renderTelemetryRadar(data.allScalesTelemetry);

      // If explicit click, refresh history from database
      if (isExplicit) {
        refreshHistory();
      }
    } catch (err) {
      window.hudAudio.playError();
      errorAlert.textContent = err.message;
      errorAlert.classList.add('active');
      tempInput.classList.add('input-invalid');
      resultDisplay.textContent = 'ERR';
      resultUnit.textContent = '';
    }
  }

  function clearOutputs() {
    errorAlert.textContent = '';
    errorAlert.classList.remove('active');
    tempInput.classList.remove('input-invalid');
    resultDisplay.textContent = '--';
    resultUnit.textContent = '';
    formulaEquation.textContent = 'Awaiting input telemetry...';
    formulaTerminal.innerHTML = '<div class="terminal-line text-muted">// Enter a valid thermal constant to execute derivation.</div>';
  }

  function renderDerivation(derivation) {
    if (!derivation) return;
    formulaEquation.textContent = derivation.formula;
    formulaTerminal.innerHTML = derivation.steps.map((s, idx) => `
      <div class="terminal-line"><span class="prompt">></span> [STEP ${idx + 1}] ${s}</div>
    `).join('');
  }

  function renderTelemetryRadar(telemetry) {
    if (!telemetry || Object.keys(telemetry).length === 0) return;
    telemetryGrid.innerHTML = Object.values(telemetry).map(item => `
      <div class="telemetry-card">
        <div class="telemetry-label">${item.name} (${item.symbol})</div>
        <div class="telemetry-value">${item.value}</div>
      </div>
    `).join('');
  }

  async function refreshHistory() {
    const list = await window.apiClient.getHistory();
    if (!list || list.length === 0) {
      historyTbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No database telemetry recorded yet.</td></tr>`;
      return;
    }

    historyTbody.innerHTML = list.slice(0, 15).map(item => `
      <tr>
        <td class="text-mono">#${item.id}</td>
        <td class="text-mono">${new Date(item.timestamp).toLocaleTimeString()}</td>
        <td><strong>${item.inputValue}</strong> ${getUnitSymbol(item.fromScale)}</td>
        <td class="text-accent">${getUnitSymbol(item.fromScale)} → ${getUnitSymbol(item.toScale)}</td>
        <td class="text-glow"><strong>${Number(item.resultValue).toFixed(item.precisionSetting === 'raw' ? 4 : item.precisionSetting)}</strong> ${getUnitSymbol(item.toScale)}</td>
        <td><span class="badge badge-state">${item.physicalState || 'Normal'}</span></td>
        <td><button class="btn-micro" data-val="${item.inputValue}" data-from="${item.fromScale}" data-to="${item.toScale}">LOAD</button></td>
      </tr>
    `).join('');

    // Wire up load buttons
    historyTbody.querySelectorAll('.btn-micro').forEach(btn => {
      btn.addEventListener('click', () => {
        tempInput.value = btn.getAttribute('data-val');
        fromScale.value = btn.getAttribute('data-from');
        toScale.value = btn.getAttribute('data-to');
        window.hudAudio.playBeep(1000, 0.05);
        executeConversion(true);
      });
    });
  }

  function updateServerStatus(health) {
    if (health && health.status === 'OPTIMAL') {
      serverStatusBadge.textContent = 'ONLINE • REST & SQLITE ACTIVE';
      serverStatusBadge.className = 'status-badge status-online';
    } else {
      serverStatusBadge.textContent = 'LOCAL CLIENT RESILIENCY ACTIVE';
      serverStatusBadge.className = 'status-badge status-fallback';
    }
  }

  function getUnitSymbol(scale) {
    const map = { C: '°C', F: '°F', K: 'K', R: '°R', De: '°De', N: '°N', Re: '°Ré', Ro: '°Rø' };
    return map[scale] || scale;
  }

  function getCelsiusEquivalent(val, scale) {
    val = Number(val);
    if (scale === 'C') return val;
    if (scale === 'F') return (val - 32) * 5 / 9;
    if (scale === 'K') return val - 273.15;
    if (scale === 'R') return (val - 491.67) * 5 / 9;
    if (scale === 'De') return 100 - (val * 2 / 3);
    return val;
  }
});
