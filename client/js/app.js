/**
 * Full-Screen TC-800 Laboratory Workstation Controller
 * Features:
 * - Thermal Heat-Flux Oscilloscope Waveform Sync
 * - Smooth Number Roller Odometer Animation
 * - Thermodynamic Energy Spectrum Marker Animation
 * - Spring-Physics Analog Galvanometer Needle
 * - Live System Clock & Uptime Telemetry
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
  const stepUpBtn = document.getElementById('stepUpBtn');
  const stepDownBtn = document.getElementById('stepDownBtn');
  const convertBtn = document.getElementById('convertBtn');
  const precisionSelect = document.getElementById('precisionSelect');
  const copyBtn = document.getElementById('copyBtn');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const crtToggleBtn = document.getElementById('crtToggleBtn');
  const liveSystemClock = document.getElementById('liveSystemClock');

  // Outputs & Visualizers
  const resultDisplay = document.getElementById('resultDisplay');
  const resultUnit = document.getElementById('resultUnit');
  const errorAlert = document.getElementById('errorAlert');
  const serverStatusBadge = document.getElementById('serverStatusBadge');
  const formulaEquation = document.getElementById('formulaEquation');
  const formulaTerminal = document.getElementById('formulaTerminal');
  const telemetryGrid = document.getElementById('telemetryGrid');
  const spectrumMarker = document.getElementById('spectrumMarker');
  const spectrumLabel = document.getElementById('spectrumLabel');
  const historyTbody = document.getElementById('historyTbody');
  const dbStatsText = document.getElementById('dbStatsText');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const exportJsonBtn = document.getElementById('exportJsonBtn');

  // Real-World Reality Guide Elements
  const realityIcon = document.getElementById('realityIcon');
  const realityTitle = document.getElementById('realityTitle');
  const rcWearText = document.getElementById('rcWearText');
  const rcWaterText = document.getElementById('rcWaterText');
  const rcTwinText = document.getElementById('rcTwinText');
  const rcSafetyText = document.getElementById('rcSafetyText');

  // Initialize Instrument: Spring-Physics Galvanometer
  const galvanometer = new PhysicalGalvanometer();

  // Number Rolling Animation State
  let currentAnimatedNum = 212.0;
  let numberAnimationId = null;

  // Start Live System Clock
  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  // Check Backend Server Health
  const health = await window.apiClient.checkHealth();
  updateServerStatus(health);

  // Load Initial Database History
  refreshHistory();

  // Initial trigger
  executeConversion(false);

  // --- Event Listeners ---

  // Live input debounce
  let debounceTimer;
  tempInput.addEventListener('input', () => {
    const val = parseFloat(tempInput.value);
    if (!isNaN(val)) {
      tempSlider.value = Math.max(-273.15, Math.min(500, val));
      scrubValueDisplay.textContent = Number(tempSlider.value).toFixed(2);
    }
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => executeConversion(false), 160);
  });

  // Step Up / Down Buttons
  stepUpBtn.addEventListener('click', () => {
    let cur = parseFloat(tempInput.value) || 0;
    cur += 1;
    tempInput.value = cur;
    tempSlider.value = Math.max(-273.15, Math.min(500, cur));
    scrubValueDisplay.textContent = Number(tempSlider.value).toFixed(2);
    window.instrumentAudio.playSliderTick();
    executeConversion(false);
  });

  stepDownBtn.addEventListener('click', () => {
    let cur = parseFloat(tempInput.value) || 0;
    cur -= 1;
    tempInput.value = cur;
    tempSlider.value = Math.max(-273.15, Math.min(500, cur));
    scrubValueDisplay.textContent = Number(tempSlider.value).toFixed(2);
    window.instrumentAudio.playSliderTick();
    executeConversion(false);
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

  // Scale Inversion (Swap)
  swapBtn.addEventListener('click', () => {
    const temp = fromScale.value;
    fromScale.value = toScale.value;
    toScale.value = temp;

    window.instrumentAudio.playRotaryClunk();
    swapBtn.classList.add('rotating');
    setTimeout(() => swapBtn.classList.remove('rotating'), 280);

    executeConversion(false);
  });

  // Master Transmute Click
  convertBtn.addEventListener('click', () => {
    window.instrumentAudio.playTransmute();
    executeConversion(true);
  });

  // Benchmark Preset Chips
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-val');
      const scale = btn.getAttribute('data-scale');

      tempInput.value = val;
      fromScale.value = scale;
      tempSlider.value = Math.max(-273.15, Math.min(500, parseFloat(val)));
      scrubValueDisplay.textContent = Number(tempSlider.value).toFixed(2);

      window.instrumentAudio.playRelayClick(1400);
      executeConversion(true);
    });
  });

  // Sound Toggle
  soundToggleBtn.addEventListener('click', () => {
    const isEnabled = window.instrumentAudio.toggleSound();
    soundToggleBtn.classList.toggle('active', isEnabled);
    soundToggleBtn.querySelector('.toggle-text').textContent = isEnabled ? 'RELAYS: ON' : 'AUDIO: MUTED';
  });

  // CRT Scanlines Toggle
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
      copyBtn.textContent = 'COPIED!';
      setTimeout(() => copyBtn.textContent = 'COPY VALUE', 1500);
    });
  });

  // Database Purge & Export Actions
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

      // Animate Numbers rolling smoothly
      const targetNumeric = parseFloat(data.resultValue);
      animateNumberRoll(targetNumeric, precisionSelect.value);
      resultUnit.textContent = getUnitSymbol(data.toScale);

      // Base Celsius for physical visualizers
      const baseC = getCelsiusEquivalent(data.inputValue, data.fromScale);

      // Dynamic Ambient Thermal Theme on Body & Aura
      updateAmbientThermalTheme(baseC);

      // Update Real-World Living Reality Guide (What to wear, water phase, everyday twin)
      updateRealWorldGuide(baseC);

      // Update Galvanometer Needle
      galvanometer.update(baseC, data.resultValue, getUnitSymbol(data.toScale), data.physicalState);

      // Update Thermodynamic Spectrum Position
      updateSpectrumMarker(baseC, data.physicalState.label);

      // Update Step-by-Step Derivation Trace
      renderDerivation(data.derivation);

      // Update 8-Scale Multi-Vector Grid
      renderTelemetryRadar(data.allScalesTelemetry);

      // Refresh database table if user triggered explicit save
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

  // Smooth Number Rolling Animation (Odometer Effect)
  function animateNumberRoll(targetVal, precisionSetting) {
    if (isNaN(targetVal)) {
      resultDisplay.textContent = '--';
      return;
    }

    if (numberAnimationId) cancelAnimationFrame(numberAnimationId);

    const startVal = currentAnimatedNum;
    const diff = targetVal - startVal;
    const duration = 280; // ms
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      currentAnimatedNum = startVal + diff * ease;

      const p = precisionSetting === 'raw' ? 4 : parseInt(precisionSetting, 10);
      resultDisplay.textContent = currentAnimatedNum.toFixed(isNaN(p) ? 4 : p);

      if (progress < 1) {
        numberAnimationId = requestAnimationFrame(step);
      } else {
        currentAnimatedNum = targetVal;
        const finalP = precisionSetting === 'raw' ? 4 : parseInt(precisionSetting, 10);
        resultDisplay.textContent = targetVal.toFixed(isNaN(finalP) ? 4 : finalP);
      }
    }

    numberAnimationId = requestAnimationFrame(step);
  }

  // Update Thermodynamic Spectrum Position
  function updateSpectrumMarker(celsius, label) {
    if (!spectrumMarker || !spectrumLabel) return;
    // Map -273.15°C to +3000°C onto 0% to 100%
    const kelvin = celsius + 273.15;
    let percent = 0;
    if (kelvin <= 0) {
      percent = 2;
    } else if (kelvin <= 273.15) {
      percent = 2 + (kelvin / 273.15) * 33; // 2% to 35%
    } else if (kelvin <= 373.15) {
      percent = 35 + ((kelvin - 273.15) / 100) * 20; // 35% to 55%
    } else if (kelvin <= 2000) {
      percent = 55 + ((kelvin - 373.15) / 1626.85) * 25; // 55% to 80%
    } else {
      percent = Math.min(98, 80 + ((kelvin - 2000) / 4000) * 18);
    }

    spectrumMarker.style.left = `${percent.toFixed(1)}%`;
    spectrumLabel.textContent = `${celsius.toFixed(1)}°C // ${label.toUpperCase()}`;
  }

  function clearOutputs() {
    errorAlert.textContent = '';
    errorAlert.classList.remove('active');
    tempInput.classList.remove('input-invalid');
    resultDisplay.textContent = '--';
    resultUnit.textContent = '';
    formulaEquation.textContent = 'Awaiting input magnitude...';
    formulaTerminal.innerHTML = '<div class="audit-line meta">// ENTER VALUE TO INITIALIZE AUDIT TRACE.</div>';
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

  function updateRealWorldGuide(celsius) {
    if (!window.RealWorldThermalContext) return;
    const ctx = window.RealWorldThermalContext.getContext(celsius);
    if (realityIcon) realityIcon.textContent = ctx.icon;
    if (realityTitle) {
      realityTitle.textContent = ctx.title;
      realityTitle.style.color = ctx.color;
    }
    if (rcWearText) rcWearText.textContent = ctx.wear;
    if (rcWaterText) rcWaterText.textContent = ctx.water;
    if (rcTwinText) rcTwinText.textContent = ctx.twin;
    if (rcSafetyText) rcSafetyText.textContent = ctx.safety;
  }

  function renderDerivation(derivation) {
    if (!derivation) return;
    formulaEquation.textContent = derivation.formula;
    formulaTerminal.innerHTML = `
      <div class="audit-line meta">// TRANSLATION ALGORITHM EXECUTION TRACE:</div>
      ${derivation.steps.map((s, idx) => `
        <div class="audit-line ${idx === derivation.steps.length - 1 ? 'highlight' : ''}">
          <span class="step-num">${idx + 1}.</span> ${s}
        </div>
      `).join('')}
    `;
  }

  function renderTelemetryRadar(telemetry) {
    if (!telemetry || Object.keys(telemetry).length === 0) return;
    telemetryGrid.innerHTML = Object.values(telemetry).map(item => `
      <div class="v-card" data-scale="${item.scale}">
        <span class="v-name">${item.name} (${item.symbol})</span>
        <span class="v-val">${item.value}</span>
      </div>
    `).join('');
  }

  async function refreshHistory() {
    const list = await window.apiClient.getHistory();
    if (dbStatsText) {
      dbStatsText.textContent = `DATABASE: ${list ? list.length : 0} RECORDS STORED`;
    }

    if (!list || list.length === 0) {
      historyTbody.innerHTML = `<tr><td colspan="7" class="empty-state">No SQLite database telemetry recorded yet.</td></tr>`;
      return;
    }

    historyTbody.innerHTML = list.slice(0, 15).map(item => `
      <tr>
        <td style="font-family: var(--font-mono); font-weight: 700; color: #ff9f1c;">#${item.id}</td>
        <td style="font-family: var(--font-mono); color: #8da2be;">${new Date(item.timestamp).toLocaleTimeString()}</td>
        <td><strong style="color: #ffffff;">${item.inputValue}</strong> ${getUnitSymbol(item.fromScale)}</td>
        <td style="font-family: var(--font-mono); color: #64748b;">${getUnitSymbol(item.fromScale)} → ${getUnitSymbol(item.toScale)}</td>
        <td><strong style="color: #ffb703; font-family: var(--font-mono); font-size: 0.95rem;">${Number(item.resultValue).toFixed(item.precisionSetting === 'raw' ? 4 : item.precisionSetting)}</strong> ${getUnitSymbol(item.toScale)}</td>
        <td><span style="background: #19202c; border: 1px solid #2d3748; padding: 0.15rem 0.5rem; border-radius: 4px; font-family: var(--font-mono); font-size: 0.7rem; color: #cbd5e1;">${item.physicalState || 'Normal'}</span></td>
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
      serverStatusBadge.innerHTML = '<span class="pill-dot"></span><span class="pill-label">SQLITE ENGINE ACTIVE</span>';
      serverStatusBadge.style.color = '#10b981';
    } else {
      serverStatusBadge.innerHTML = '<span class="pill-dot" style="background:#f59e0b; box-shadow:0 0 8px #f59e0b;"></span><span class="pill-label">OFFLINE FALLBACK ACTIVE</span>';
      serverStatusBadge.style.color = '#f59e0b';
    }
  }

  function updateLiveClock() {
    if (!liveSystemClock) return;
    const now = new Date();
    liveSystemClock.textContent = now.toTimeString().split(' ')[0] + ' UTC';
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
