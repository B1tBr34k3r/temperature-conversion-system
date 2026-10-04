/**
 * Temperature Conversion System - Milestone 2 Core Implementation
 * Authors: Prakhar Harne & Naman Shrivastav
 * 
 * Modules:
 * 1. Physical Constants & Units Definition
 * 2. InputValidator: Robust parsing and thermodynamic boundary verification
 * 3. TemperatureConverter: High-precision floating point conversion algorithms
 * 4. FormulaExplainer: Step-by-step derivation generator
 * 5. StorageManager: Fault-tolerant history persistence with localStorage & in-memory fallback
 * 6. UIController: DOM event binding, rendering, and interaction
 */

// ==========================================
// 1. CONSTANTS & SPECIFICATIONS
// ==========================================
const ABSOLUTE_ZERO = {
  C: -273.15,
  F: -459.67,
  K: 0.0
};

const UNIT_LABELS = {
  C: 'Celsius (°C)',
  F: 'Fahrenheit (°F)',
  K: 'Kelvin (K)'
};

const UNIT_SYMBOLS = {
  C: '°C',
  F: '°F',
  K: 'K'
};

// ==========================================
// 2. INPUT VALIDATION MODULE
// ==========================================
class InputValidator {
  /**
   * Validates raw user input string against numerical rules and physical limits
   * @param {string} rawInput 
   * @param {'C'|'F'|'K'} unit 
   * @returns {{ isValid: boolean, value?: number, error?: string }}
   */
  static validate(rawInput, unit) {
    if (rawInput === undefined || rawInput === null) {
      return { isValid: false, error: 'Input cannot be empty.' };
    }

    const trimmed = String(rawInput).trim();
    if (trimmed === '') {
      return { isValid: false, error: 'Please enter a temperature value.' };
    }

    // Strict numerical pattern check (allowing optional leading +/- and decimal point)
    const numericRegex = /^[+-]?((\d+(\.\d*)?)|(\.\d+))([eE][+-]?\d+)?$/;
    if (!numericRegex.test(trimmed)) {
      return { isValid: false, error: 'Invalid format. Please enter a valid numerical value.' };
    }

    const numericValue = Number(trimmed);
    if (!Number.isFinite(numericValue)) {
      return { isValid: false, error: 'Value must be a finite real number.' };
    }

    // Thermodynamic lower limit check (Absolute Zero)
    const minAllowed = ABSOLUTE_ZERO[unit];
    // Use epsilon margin for floating point boundary comparisons
    if (numericValue < minAllowed - 1e-9) {
      return {
        isValid: false,
        error: `Physical limit violation: Temperature cannot fall below Absolute Zero (${minAllowed}${UNIT_SYMBOLS[unit]}).`
      };
    }

    // Optional astronomical upper limit check (Planck temperature: 1.4168e32 K)
    if (Math.abs(numericValue) > 1e15) {
      return { isValid: false, error: 'Value exceeds practical computing range (±1e15).' };
    }

    return { isValid: true, value: numericValue };
  }
}

// ==========================================
// 3. CORE CONVERSION ALGORITHMS
// ==========================================
class TemperatureConverter {
  /**
   * Rounds a number to specific decimal places while mitigating IEEE 754 precision errors
   * @param {number} value 
   * @param {number|'raw'} precision 
   * @returns {number|string}
   */
  static formatPrecision(value, precision) {
    if (precision === 'raw') return value;
    const places = parseInt(precision, 10);
    if (isNaN(places) || places < 0) return value;
    // Rounding using exponent to counter binary floating point drift
    const factor = Math.pow(10, places);
    const rounded = Math.round((value + Number.EPSILON) * factor) / factor;
    return rounded.toFixed(places);
  }

  /**
   * Direct high-precision mathematical transformations
   */
  static celsiusToFahrenheit(c) {
    return (c * 9.0 / 5.0) + 32.0;
  }

  static fahrenheitToCelsius(f) {
    return (f - 32.0) * (5.0 / 9.0);
  }

  static celsiusToKelvin(c) {
    return c + 273.15;
  }

  static kelvinToCelsius(k) {
    return k - 273.15;
  }

  static fahrenheitToKelvin(f) {
    return ((f - 32.0) * (5.0 / 9.0)) + 273.15;
  }

  static kelvinToFahrenheit(k) {
    return ((k - 273.15) * 9.0 / 5.0) + 32.0;
  }

  /**
   * Master conversion dispatcher
   * @param {number} value 
   * @param {'C'|'F'|'K'} fromUnit 
   * @param {'C'|'F'|'K'} toUnit 
   * @returns {number}
   */
  static convert(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value;

    if (fromUnit === 'C' && toUnit === 'F') return this.celsiusToFahrenheit(value);
    if (fromUnit === 'F' && toUnit === 'C') return this.fahrenheitToCelsius(value);
    if (fromUnit === 'C' && toUnit === 'K') return this.celsiusToKelvin(value);
    if (fromUnit === 'K' && toUnit === 'C') return this.kelvinToCelsius(value);
    if (fromUnit === 'F' && toUnit === 'K') return this.fahrenheitToKelvin(value);
    if (fromUnit === 'K' && toUnit === 'F') return this.kelvinToFahrenheit(value);

    throw new Error(`Unsupported conversion: ${fromUnit} -> ${toUnit}`);
  }
}

// ==========================================
// 4. FORMULA & EXPLANATION GENERATOR
// ==========================================
class FormulaExplainer {
  static getExplanation(value, fromUnit, toUnit, rawResult, formattedResult) {
    if (fromUnit === toUnit) {
      return {
        formula: `${UNIT_SYMBOLS[toUnit]} = ${UNIT_SYMBOLS[fromUnit]}`,
        steps: `Identity conversion: Value remains ${formattedResult} ${UNIT_SYMBOLS[toUnit]}.`
      };
    }

    switch (`${fromUnit}->${toUnit}`) {
      case 'C->F':
        return {
          formula: `°F = (°C × 9/5) + 32`,
          steps: `1. Multiply input by 9/5: ${value} × 1.8 = ${(value * 1.8).toFixed(6)}\n` +
                 `2. Add 32: ${(value * 1.8).toFixed(6)} + 32 = ${rawResult}\n` +
                 `3. Final formatted result: ${formattedResult} °F`
        };
      case 'F->C':
        return {
          formula: `°C = (°F - 32) × 5/9`,
          steps: `1. Subtract 32 from input: ${value} - 32 = ${(value - 32).toFixed(6)}\n` +
                 `2. Multiply by 5/9 (0.555556...): ${(value - 32).toFixed(6)} × 5/9 = ${rawResult}\n` +
                 `3. Final formatted result: ${formattedResult} °C`
        };
      case 'C->K':
        return {
          formula: `K = °C + 273.15`,
          steps: `1. Add absolute scale offset: ${value} + 273.15 = ${rawResult}\n` +
                 `2. Final formatted result: ${formattedResult} K`
        };
      case 'K->C':
        return {
          formula: `°C = K - 273.15`,
          steps: `1. Subtract absolute scale offset: ${value} - 273.15 = ${rawResult}\n` +
                 `2. Final formatted result: ${formattedResult} °C`
        };
      case 'F->K':
        return {
          formula: `K = (°F - 32) × 5/9 + 273.15`,
          steps: `1. Convert °F to Celsius: (${value} - 32) × 5/9 = ${((value - 32) * 5 / 9).toFixed(6)} °C\n` +
                 `2. Convert Celsius to Kelvin: + 273.15 = ${rawResult}\n` +
                 `3. Final formatted result: ${formattedResult} K`
        };
      case 'K->F':
        return {
          formula: `°F = (K - 273.15) × 9/5 + 32`,
          steps: `1. Convert Kelvin to Celsius: ${value} - 273.15 = ${(value - 273.15).toFixed(6)} °C\n` +
                 `2. Convert Celsius to °F: (${(value - 273.15).toFixed(6)} × 1.8) + 32 = ${rawResult}\n` +
                 `3. Final formatted result: ${formattedResult} °F`
        };
      default:
        return { formula: '', steps: '' };
    }
  }

  static getPhysicalState(celsiusValue) {
    if (celsiusValue <= -273.10) return { icon: '❄️🧊', text: 'At or near Absolute Zero (0 K)' };
    if (celsiusValue < 0) return { icon: '❄️', text: 'Sub-Zero Freezing (Water is solid ice)' };
    if (celsiusValue === 0) return { icon: '🧊💧', text: 'Water Freezing Point (0°C / 32°F)' };
    if (celsiusValue > 0 && celsiusValue < 20) return { icon: '🧥', text: 'Cool / Chilly environment' };
    if (celsiusValue >= 20 && celsiusValue <= 25) return { icon: '🛋️', text: 'Comfortable Room Temperature' };
    if (celsiusValue >= 36 && celsiusValue <= 38) return { icon: '🏃', text: 'Normal Human Body Temperature (~37°C)' };
    if (celsiusValue >= 100) return { icon: '🔥💨', text: 'Water Boiling Point or Superheated (≥100°C)' };
    return { icon: '🌡️', text: 'Moderate Temperature' };
  }
}

// ==========================================
// 5. STORAGE & RISK MITIGATION MODULE
// ==========================================
class StorageManager {
  static STORAGE_KEY = 'sdms_temp_conversion_history_m2';
  static inMemoryFallback = [];

  static isLocalStorageAvailable() {
    try {
      const testKey = '__sdms_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('LocalStorage unavailable or disabled (e.g., Private mode, sandboxing). Using in-memory fallback.');
      return false;
    }
  }

  static saveEntry(entry) {
    const list = this.getHistory();
    list.unshift(entry);
    const trimmed = list.slice(0, 30); // Store up to 30 recent records

    if (this.isLocalStorageAvailable()) {
      try {
        window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmed));
      } catch (err) {
        console.warn('LocalStorage write failed (quota exceeded). Fallback activated.', err);
        this.inMemoryFallback = trimmed;
      }
    } else {
      this.inMemoryFallback = trimmed;
    }
  }

  static getHistory() {
    if (this.isLocalStorageAvailable()) {
      try {
        const raw = window.localStorage.getItem(this.STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (err) {
        console.warn('LocalStorage read corrupted. Resetting fallback.', err);
        return this.inMemoryFallback;
      }
    }
    return this.inMemoryFallback;
  }

  static clearHistory() {
    if (this.isLocalStorageAvailable()) {
      try {
        window.localStorage.removeItem(this.STORAGE_KEY);
      } catch (e) {}
    }
    this.inMemoryFallback = [];
  }
}

// ==========================================
// 6. UI CONTROLLER & EVENT WIRING
// ==========================================
class UIController {
  constructor() {
    this.dom = {
      tempInput: document.getElementById('tempInput'),
      fromUnit: document.getElementById('fromUnit'),
      toUnit: document.getElementById('toUnit'),
      swapBtn: document.getElementById('swapBtn'),
      convertBtn: document.getElementById('convertBtn'),
      resetBtn: document.getElementById('resetBtn'),
      copyBtn: document.getElementById('copyBtn'),
      precisionSelect: document.getElementById('precisionSelect'),
      inputUnitSymbol: document.getElementById('inputUnitSymbol'),
      errorMessage: document.getElementById('errorMessage'),
      resultOutput: document.getElementById('resultOutput'),
      resultUnitSymbol: document.getElementById('resultUnitSymbol'),
      formulaEquation: document.getElementById('formulaEquation'),
      formulaSteps: document.getElementById('formulaSteps'),
      stateIcon: document.getElementById('stateIcon'),
      stateText: document.getElementById('stateText'),
      historyTableBody: document.getElementById('historyTableBody'),
      clearHistoryBtn: document.getElementById('clearHistoryBtn'),
      chips: document.querySelectorAll('.chip')
    };

    this.initEventListeners();
    this.renderHistoryTable();
  }

  initEventListeners() {
    this.dom.fromUnit.addEventListener('change', () => {
      this.dom.inputUnitSymbol.textContent = UNIT_SYMBOLS[this.dom.fromUnit.value];
      this.performConversion(false);
    });

    this.dom.toUnit.addEventListener('change', () => {
      this.performConversion(false);
    });

    this.dom.precisionSelect.addEventListener('change', () => {
      this.performConversion(false);
    });

    this.dom.swapBtn.addEventListener('click', () => {
      const from = this.dom.fromUnit.value;
      this.dom.fromUnit.value = this.dom.toUnit.value;
      this.dom.toUnit.value = from;
      this.dom.inputUnitSymbol.textContent = UNIT_SYMBOLS[this.dom.fromUnit.value];
      this.performConversion(false);
    });

    this.dom.tempInput.addEventListener('input', () => {
      this.performConversion(false);
    });

    this.dom.convertBtn.addEventListener('click', () => {
      this.performConversion(true);
    });

    this.dom.resetBtn.addEventListener('click', () => {
      this.resetForm();
    });

    this.dom.copyBtn.addEventListener('click', () => {
      this.copyResult();
    });

    this.dom.clearHistoryBtn.addEventListener('click', () => {
      StorageManager.clearHistory();
      this.renderHistoryTable();
    });

    this.dom.chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const val = chip.getAttribute('data-val');
        const unit = chip.getAttribute('data-unit');
        this.dom.tempInput.value = val;
        this.dom.fromUnit.value = unit;
        this.dom.inputUnitSymbol.textContent = UNIT_SYMBOLS[unit];
        this.performConversion(true);
      });
    });
  }

  resetForm() {
    this.dom.tempInput.value = '';
    this.dom.fromUnit.value = 'C';
    this.dom.toUnit.value = 'F';
    this.dom.inputUnitSymbol.textContent = '°C';
    this.dom.errorMessage.textContent = '';
    this.dom.tempInput.classList.remove('invalid');
    this.dom.resultOutput.textContent = '--';
    this.dom.resultUnitSymbol.textContent = '';
    this.dom.formulaEquation.textContent = 'Please enter a valid temperature to view formula steps.';
    this.dom.formulaSteps.textContent = '';
    this.dom.stateIcon.textContent = '🌡️';
    this.dom.stateText.textContent = 'Normal Range';
  }

  performConversion(recordHistory = false) {
    const rawVal = this.dom.tempInput.value;
    const fromUnit = this.dom.fromUnit.value;
    const toUnit = this.dom.toUnit.value;
    const precision = this.dom.precisionSelect.value;

    if (rawVal.trim() === '') {
      this.dom.errorMessage.textContent = '';
      this.dom.tempInput.classList.remove('invalid');
      this.dom.resultOutput.textContent = '--';
      this.dom.resultUnitSymbol.textContent = '';
      this.dom.formulaEquation.textContent = 'Please enter a valid temperature to view formula steps.';
      this.dom.formulaSteps.textContent = '';
      return;
    }

    const validation = InputValidator.validate(rawVal, fromUnit);
    if (!validation.isValid) {
      this.dom.errorMessage.textContent = validation.error;
      this.dom.tempInput.classList.add('invalid');
      this.dom.resultOutput.textContent = 'Error';
      this.dom.resultUnitSymbol.textContent = '';
      this.dom.formulaEquation.textContent = 'Calculation stopped due to validation failure.';
      this.dom.formulaSteps.textContent = '';
      return;
    }

    // Input is valid
    this.dom.errorMessage.textContent = '';
    this.dom.tempInput.classList.remove('invalid');

    const inputVal = validation.value;
    const rawResult = TemperatureConverter.convert(inputVal, fromUnit, toUnit);
    const formattedResult = TemperatureConverter.formatPrecision(rawResult, precision);

    // Update Display
    this.dom.resultOutput.textContent = formattedResult;
    this.dom.resultUnitSymbol.textContent = UNIT_SYMBOLS[toUnit];

    // Mathematical Breakdown
    const explanation = FormulaExplainer.getExplanation(inputVal, fromUnit, toUnit, rawResult, formattedResult);
    this.dom.formulaEquation.textContent = explanation.formula;
    this.dom.formulaSteps.innerText = explanation.steps;

    // Physical indicator (based on Celsius equivalent)
    const celsiusEquiv = TemperatureConverter.convert(inputVal, fromUnit, 'C');
    const state = FormulaExplainer.getPhysicalState(celsiusEquiv);
    this.dom.stateIcon.textContent = state.icon;
    this.dom.stateText.textContent = `${state.text} (${celsiusEquiv.toFixed(2)} °C equivalent)`;

    if (recordHistory) {
      const entry = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        input: inputVal,
        from: fromUnit,
        result: formattedResult,
        to: toUnit,
        status: 'Success'
      };
      StorageManager.saveEntry(entry);
      this.renderHistoryTable();
    }
  }

  copyResult() {
    const text = this.dom.resultOutput.textContent;
    const unit = this.dom.resultUnitSymbol.textContent;
    if (text === '--' || text === 'Error') return;

    const fullStr = `${text} ${unit}`;
    navigator.clipboard.writeText(fullStr).then(() => {
      const originalText = this.dom.copyBtn.querySelector('span').textContent;
      this.dom.copyBtn.querySelector('span').textContent = 'Copied!';
      setTimeout(() => {
        this.dom.copyBtn.querySelector('span').textContent = originalText;
      }, 1800);
    }).catch(err => {
      console.warn('Clipboard write error', err);
    });
  }

  renderHistoryTable() {
    const history = StorageManager.getHistory();
    if (!history || history.length === 0) {
      this.dom.historyTableBody.innerHTML = `
        <tr class="empty-row">
          <td colspan="7">No conversion history recorded yet.</td>
        </tr>
      `;
      return;
    }

    this.dom.historyTableBody.innerHTML = history.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.timestamp}</td>
        <td><strong>${item.input}</strong></td>
        <td>${UNIT_LABELS[item.from]}</td>
        <td><strong>${item.result}</strong></td>
        <td>${UNIT_LABELS[item.to]}</td>
        <td><span class="badge-status badge-valid">${item.status}</span></td>
      </tr>
    `).join('');
  }
}

// Export for testing in Node / browser test runners
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ABSOLUTE_ZERO,
    InputValidator,
    TemperatureConverter,
    FormulaExplainer,
    StorageManager
  };
}

// Boot UI when running in standard browser context
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.tempApp = new UIController();
  });
}
