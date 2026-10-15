/**
 * Laboratory Bench Instrument Model TC-800 • Master Controller
 * Milestone 3: Full-Stack Integration
 * Authors: Prakhar Harne & Naman Shrivastav
 */

document.addEventListener('DOMContentLoaded', async () => {
  // DOM Elements
  const tempInput = document.getElementById('tempInput');
  const tempSlider = document.getElementById('tempSlider');
  const scrubValueDisplay = document.getElementById('scrubValueDisplay');
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

  // Initialize Hardware Visualizers: Galvanometer & Particle Chamber
  const galvanometer = new PhysicalGalvanometer();
  const particleReactor = new ThermalParticleReactor('thermalCanvas');

  // Check Backend Server Health
  const health = await window.apiClient.checkHealth();
  updateServerStatus(health);

  // Load Initial Database History
  refreshHistory();

  // Initial trigger with starting value 100°C -> °F
  executeConversion(false);

  // --- Event Listeners ---

  // Text input with debounce
  let debounceTimer;
  tempInput.addEventListener('input', () => {
    const val = parseFloat(tempInput.value);
    if (!isNaN(val)) {
      tempSlider.value = Math.max(-273.15, Math.min(500, val));
      scrubValueDisplay.textContent = Number(tempSlider.value).toFixed(2);
    }
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => executeConversion(false), 180);
  });

  // Continuous Scrubber Slider
  tempSlider.addEventListener('input', () => {
    tempInput.value = tempSlider.value;
    scrubValueDisplay.textContent = Number(tempSlider.value).toFixed(2);
    window.instrumentAudio.playSliderTick();
    executeConversion(false);
  });

  // Scale dropdown changes
  fromScale.addEventListener('change', () => {
    window.instrumentAudio.playRotaryClunk();
    executeConversion(false);
  });

  toScale.addEventListener('change', () => {
    window.instrumentAudio.playRotaryClunk();
    executeConversion(false);
  });

  precisionSelect.addEventListener('change', () => {
    window.instrumentAudio.playRelayClick(800);
    executeConversion(false);
  });

  // Tactile Invert Swap Lever
  swapBtn.addEventListener('click', () => {
    const temp = fromScale.value;
    fromScale.value = toScale.value;
    toScale.value = temp;

    window.instrumentAudio.playRotaryClunk();
    swapBtn.classList.add('rotating');
    setTimeout(() => swapBtn.classList.remove('rotating'), 300);

    executeConversion(false);
  });

  // Transmute / Convert Button Click
  convertBtn.addEventListener('click', () => {
    window.instrumentAudio.playTransmute();
    executeConversion(true);
  });

  // Bench Preset Chips
  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.getAttribute('data-val');
      const scale = chip.getAttribute('data-scale');

      tempInput.value = val;
      fromScale.value = scale;
      tempSlider.value = Math.max(-273.15, Math.min(500, parseFloat(val)));
      scrubValueDisplay.textContent = Number(tempSlider.value).toFixed(2);

      window.instrumentAudio.playRelayClick(1400);
      executeConversion(true);
    });
  });

  // Audio Toggle
  soundToggleBtn.addEventListener('click', () => {
    const isEnabled = window.instrumentAudio.toggleSound();
    soundToggleBtn.classList.toggle('active', isEnabled);
    soundToggleBtn.querySelector('.toggle-text').textContent = isEnabled ? 'RELAY CLICKS: ON' : 'AUDIO: MUTED';
  });

  // Phosphor CRT Scanlines Toggle
  crtToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('crt-active');
    crtToggleBtn.classList.toggle('active');
    window.instrumentAudio.playRelayClick(950);
  });

  // Copy Result Button
  copyBtn.addEventListener('click', () => {
    const text = resultDisplay.textContent;
    const unit = resultUnit.textContent;
    if (text === '--' || text === 'ERR') return;

    navigator.clipboard.writeText(`${text} ${unit}`).then(() => {
      window.instrumentAudio.playRelayClick(2200);
      const span = copyBtn.querySelector('span');
      span.textContent = 'COPIED TO CLIPBOARD';
      setTimeout(() => span.textContent = 'COPY RESULT', 1600);
    });
  });

  // Database Purge & Export
  clearHistoryBtn.addEventListener('click', async () => {
    window.instrumentAudio.playRelayClick(400);
    if (confirm('Purge all historical telemetry from SQLite database?')) {
      await window.apiClient.clearHistory();
      refreshHistory();
    }
  });

  exportCsvBtn.addEventListener('click', () => {
    window.instrumentAudio.playRelayClick(1600);
    window.location.href = '/api/export/csv';
  });

  exportJsonBtn.addEventListener('click', () => {
    window.instrumentAudio.playRelayClick(1600);
    window.location.href = '/api/export/json';
  });

  // --- Core Execution Logic ---
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

      // Base Celsius for physical simulation
      const baseC = getCelsiusEquivalent(data.inputValue, data.fromScale);

      // Dynamic Ambient Thermal Theme on Body & Aura
      updateAmbientThermalTheme(baseC);

      // Update Kinetic Brownian Molecular Simulation
      particleReactor.setTemperature(baseC);

      // Update Galvanometer Needle & Liquid Mercury Tube
      galvanometer.update(baseC, data.resultValue, getUnitSymbol(data.toScale), data.physicalState);

      // Update Step-by-Step Derivation Trace
      renderDerivation(data.derivation);

      // Update 8-Scale Multi-Vector Tiles
      renderTelemetryRadar(data.allScalesTelemetry);

      // If user clicked execute, refresh database table
      if (isExplicit) {
        refreshHistory();
      }
    } catch (err) {
      window.instrumentAudio.playError();
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
    formulaEquation.textContent = 'Awaiting input magnitude...';
    formulaTerminal.innerHTML = '<div class="trace-line header-trace">// ENTER VALUE TO INITIALIZE AUDIT TRACE.</div>';
  }

  function updateAmbientThermalTheme(celsius) {
    document.body.classList.remove('theme-cryo', 'theme-boil', 'theme-ambient');
    if (celsius <= 0) {
      document.body.classList.add('theme-cryo');
    } else if (celsius >= 100) {
      document.body.classList.add('theme-boil');
    } else {
      document.body.classList.add('theme-ambient');
    }
  }

  function renderDerivation(derivation) {
    if (!derivation) return;
    formulaEquation.textContent = derivation.formula;
    formulaTerminal.innerHTML = `
      <div class="trace-line header-trace">// PHYSICAL TRANSFORMATION MATRIX:</div>
      ${derivation.steps.map((s, idx) => `
        <div class="trace-line ${idx === derivation.steps.length - 1 ? 'highlight' : ''}">
          <span class="bullet">${idx + 1}.</span> ${s}
        </div>
      `).join('')}
    `;
  }

  function renderTelemetryRadar(telemetry) {
    if (!telemetry || Object.keys(telemetry).length === 0) return;
    telemetryGrid.innerHTML = Object.values(telemetry).map(item => `
      <div class="vector-tile" data-scale="${item.scale}">
        <span class="v-label">${item.name} (${item.symbol})</span>
        <span class="v-val">${item.value}</span>
      </div>
    `).join('');
  }

  async function refreshHistory() {
    const list = await window.apiClient.getHistory();
    if (!list || list.length === 0) {
      historyTbody.innerHTML = `<tr><td colspan="7" class="empty-cell">No SQLite database telemetry recorded yet.</td></tr>`;
      return;
    }

    historyTbody.innerHTML = list.slice(0, 15).map(item => `
      <tr>
        <td style="font-family: var(--font-mono); font-weight: 700; color: #ff9f1c;">#${item.id}</td>
        <td style="font-family: var(--font-mono); color: #94a3b8;">${new Date(item.timestamp).toLocaleTimeString()}</td>
        <td><strong style="color: #ffffff;">${item.inputValue}</strong> ${getUnitSymbol(item.fromScale)}</td>
        <td style="font-family: var(--font-mono); color: #64748b;">${getUnitSymbol(item.fromScale)} → ${getUnitSymbol(item.toScale)}</td>
        <td><strong style="color: #ffb703; font-family: var(--font-mono); font-size: 0.95rem;">${Number(item.resultValue).toFixed(item.precisionSetting === 'raw' ? 4 : item.precisionSetting)}</strong> ${getUnitSymbol(item.toScale)}</td>
        <td><span style="background: #1e2634; border: 1px solid #334155; padding: 0.2rem 0.5rem; border-radius: 4px; font-family: var(--font-mono); font-size: 0.72rem; color: #cbd5e1;">${item.physicalState || 'Normal'}</span></td>
        <td><button class="tactile-mini-btn btn-load" data-val="${item.inputValue}" data-from="${item.fromScale}" data-to="${item.toScale}">RECALL</button></td>
      </tr>
    `).join('');

    // Wire up recall buttons
    historyTbody.querySelectorAll('.btn-load').forEach(btn => {
      btn.addEventListener('click', () => {
        tempInput.value = btn.getAttribute('data-val');
        fromScale.value = btn.getAttribute('data-from');
        toScale.value = btn.getAttribute('data-to');
        tempSlider.value = Math.max(-273.15, Math.min(500, parseFloat(btn.getAttribute('data-val'))));
        scrubValueDisplay.textContent = Number(tempSlider.value).toFixed(2);
        window.instrumentAudio.playRelayClick(1800);
        executeConversion(true);
      });
    });
  }

  function updateServerStatus(health) {
    if (health && health.status === 'OPTIMAL') {
      serverStatusBadge.innerHTML = '<span class="pill-dot"></span><span class="pill-label">SQLITE ENGINE: ACTIVE (WAL)</span>';
      serverStatusBadge.style.color = '#10b981';
    } else {
      serverStatusBadge.innerHTML = '<span class="pill-dot" style="background:#f59e0b; box-shadow:0 0 8px #f59e0b;"></span><span class="pill-label">CLIENT RESILIENCY FALLBACK</span>';
      serverStatusBadge.style.color = '#f59e0b';
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
    if (scale === 'N') return val * (100 / 33);
    if (scale === 'Re') return val * 1.25;
    if (scale === 'Ro') return (val - 7.5) * (40 / 21);
    return val;
  }
});
