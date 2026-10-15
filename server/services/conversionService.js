/**
 * Conversion Service (High-Precision Multi-Scale Scientific Engine)
 * Milestone 3: Core Module Implementation
 * Authors: Prakhar Harne & Naman Shrivastav
 */

const SCALES = {
  C: { name: 'Celsius', symbol: '°C', absoluteZero: -273.15, boilingWater: 100 },
  F: { name: 'Fahrenheit', symbol: '°F', absoluteZero: -459.67, boilingWater: 212 },
  K: { name: 'Kelvin', symbol: 'K', absoluteZero: 0.0, boilingWater: 373.15 },
  R: { name: 'Rankine', symbol: '°R', absoluteZero: 0.0, boilingWater: 671.67 },
  De: { name: 'Delisle', symbol: '°De', absoluteZero: 559.725, boilingWater: 0 },
  N: { name: 'Newton', symbol: '°N', absoluteZero: -90.1395, boilingWater: 33 },
  Re: { name: 'Réaumur', symbol: '°Ré', absoluteZero: -218.52, boilingWater: 80 },
  Ro: { name: 'Rømer', symbol: '°Rø', absoluteZero: -135.90375, boilingWater: 60 }
};

class ConversionService {
  /**
   * Convert any scale to base Celsius
   */
  static toCelsius(value, scale) {
    switch (scale) {
      case 'C': return value;
      case 'F': return (value - 32.0) * (5.0 / 9.0);
      case 'K': return value - 273.15;
      case 'R': return (value - 491.67) * (5.0 / 9.0);
      case 'De': return 100.0 - (value * 2.0 / 3.0);
      case 'N': return value * (100.0 / 33.0);
      case 'Re': return value * (5.0 / 4.0);
      case 'Ro': return (value - 7.5) * (40.0 / 21.0);
      default: throw new Error(`Unknown source scale: ${scale}`);
    }
  }

  /**
   * Convert base Celsius to any target scale
   */
  static fromCelsius(c, scale) {
    switch (scale) {
      case 'C': return c;
      case 'F': return (c * 9.0 / 5.0) + 32.0;
      case 'K': return c + 273.15;
      case 'R': return (c + 273.15) * (9.0 / 5.0);
      case 'De': return (100.0 - c) * 1.5;
      case 'N': return c * 0.33;
      case 'Re': return c * 0.8;
      case 'Ro': return (c * 21.0 / 40.0) + 7.5;
      default: throw new Error(`Unknown target scale: ${scale}`);
    }
  }

  /**
   * Convert directly between any two scales
   */
  static convert(value, fromScale, toScale) {
    if (fromScale === toScale) return value;

    // Direct high-precision optimization for primary triad
    if (fromScale === 'C' && toScale === 'F') return (value * 9.0 / 5.0) + 32.0;
    if (fromScale === 'F' && toScale === 'C') return (value - 32.0) * (5.0 / 9.0);
    if (fromScale === 'C' && toScale === 'K') return value + 273.15;
    if (fromScale === 'K' && toScale === 'C') return value - 273.15;
    if (fromScale === 'F' && toScale === 'K') return ((value - 32.0) * (5.0 / 9.0)) + 273.15;
    if (fromScale === 'K' && toScale === 'F') return ((value - 273.15) * 9.0 / 5.0) + 32.0;

    // Canonical intermediate Celsius conversion
    const c = this.toCelsius(value, fromScale);
    return this.fromCelsius(c, toScale);
  }

  /**
   * Convert to all 8 scales simultaneously (for HUD telemetry radar)
   */
  static convertToAllScales(value, fromScale, precision = '4') {
    const c = this.toCelsius(value, fromScale);
    const telemetry = {};

    for (const key of Object.keys(SCALES)) {
      const raw = this.fromCelsius(c, key);
      telemetry[key] = {
        scale: key,
        name: SCALES[key].name,
        symbol: SCALES[key].symbol,
        value: this.formatPrecision(raw, precision),
        raw
      };
    }

    return telemetry;
  }

  /**
   * Precision formatting with IEEE 754 epsilon guard
   */
  static formatPrecision(val, precision = '4') {
    if (precision === 'raw') return val;
    const places = parseInt(precision, 10);
    if (isNaN(places) || places < 0) return val;
    const factor = Math.pow(10, places);
    const rounded = Math.round((val + Number.EPSILON) * factor) / factor;
    return rounded.toFixed(places);
  }

  /**
   * Educational Step-by-Step Formula Derivation
   */
  static getFormulaBreakdown(value, fromScale, toScale, rawResult, formattedResult) {
    const sFrom = SCALES[fromScale] ? SCALES[fromScale].symbol : fromScale;
    const sTo = SCALES[toScale] ? SCALES[toScale].symbol : toScale;

    if (fromScale === toScale) {
      return {
        formula: `${sTo} = ${sFrom}`,
        steps: [`Identity transform: Value remains ${formattedResult} ${sTo}`]
      };
    }

    const c = this.toCelsius(value, fromScale);

    if (fromScale === 'C' && toScale === 'F') {
      return {
        formula: '°F = (°C × 9/5) + 32',
        steps: [
          `Multiply input by 1.8 (9/5): ${value} × 1.8 = ${(value * 1.8).toFixed(6)}`,
          `Add 32 offset: ${(value * 1.8).toFixed(6)} + 32 = ${rawResult.toFixed(6)}`,
          `Final precision value: ${formattedResult} °F`
        ]
      };
    }

    if (fromScale === 'F' && toScale === 'C') {
      return {
        formula: '°C = (°F - 32) × 5/9',
        steps: [
          `Subtract 32 offset: ${value} - 32 = ${(value - 32).toFixed(6)}`,
          `Multiply by 5/9: ${(value - 32).toFixed(6)} × 5/9 = ${rawResult.toFixed(6)}`,
          `Final precision value: ${formattedResult} °C`
        ]
      };
    }

    if (fromScale === 'C' && toScale === 'K') {
      return {
        formula: 'K = °C + 273.15',
        steps: [
          `Add Absolute Zero offset: ${value} + 273.15 = ${rawResult.toFixed(6)}`,
          `Final precision value: ${formattedResult} K`
        ]
      };
    }

    if (fromScale === 'K' && toScale === 'C') {
      return {
        formula: '°C = K - 273.15',
        steps: [
          `Subtract Absolute Zero offset: ${value} - 273.15 = ${rawResult.toFixed(6)}`,
          `Final precision value: ${formattedResult} °C`
        ]
      };
    }

    // General multi-step representation
    return {
      formula: `${sTo} = ƒ(${sFrom}) via Base Celsius Model`,
      steps: [
        `Step 1: Normalize ${value} ${sFrom} to Base Celsius: ${c.toFixed(6)} °C`,
        `Step 2: Project Celsius into target ${SCALES[toScale].name} (${sTo}): ${rawResult.toFixed(6)}`,
        `Step 3: Stabilize & format precision: ${formattedResult} ${sTo}`
      ]
    };
  }

  /**
   * Determine thermal physical milestone based on Celsius value
   */
  static getPhysicalState(celsiusValue) {
    if (celsiusValue <= -273.14) {
      return { label: 'Absolute Zero (0 K)', tier: 'cryo-core', icon: '❄️⚛️', color: '#38bdf8' };
    }
    if (celsiusValue <= -195.79) {
      return { label: 'Liquid Nitrogen Boiling Point (-195.8°C)', tier: 'cryo', icon: '🧊💨', color: '#0ea5e9' };
    }
    if (celsiusValue <= -78.5) {
      return { label: 'Dry Ice Sublimation Point (-78.5°C)', tier: 'sub-zero', icon: '❄️', color: '#06b6d4' };
    }
    if (celsiusValue < 0) {
      return { label: 'Sub-Zero Freezing (<0°C)', tier: 'freeze', icon: '❄️💧', color: '#22d3ee' };
    }
    if (celsiusValue === 0) {
      return { label: 'Water Freezing Point (0°C / 32°F)', tier: 'equilibrium', icon: '🧊', color: '#10b981' };
    }
    if (celsiusValue > 0 && celsiusValue < 18) {
      return { label: 'Cool / Chilly Ambient (0–18°C)', tier: 'ambient-cool', icon: '🧥', color: '#14b8a6' };
    }
    if (celsiusValue >= 18 && celsiusValue <= 26) {
      return { label: 'Comfort Living Zone (18–26°C)', tier: 'ambient', icon: '🛋️', color: '#10b981' };
    }
    if (celsiusValue > 26 && celsiusValue < 36.5) {
      return { label: 'Warm Summer Weather (26–36°C)', tier: 'warm', icon: '☀️', color: '#f59e0b' };
    }
    if (celsiusValue >= 36.5 && celsiusValue <= 38.5) {
      return { label: 'Human Body Temperature (~37°C)', tier: 'bio-heat', icon: '🏃', color: '#f97316' };
    }
    if (celsiusValue > 38.5 && celsiusValue < 100) {
      return { label: 'Hot Domestic Water & Beverages (39–99°C)', tier: 'hot-drink', icon: '☕🚿', color: '#f97316' };
    }
    if (celsiusValue >= 100 && celsiusValue <= 105) {
      return { label: 'Water Boiling Point / Steam (100°C)', tier: 'thermal-high', icon: '🫖🔥', color: '#ef4444' };
    }
    if (celsiusValue > 105 && celsiusValue < 500) {
      return { label: 'Baking & Industrial Heat (105–500°C)', tier: 'thermal-high', icon: '🍕🔥', color: '#ef4444' };
    }
    if (celsiusValue >= 500 && celsiusValue < 5500) {
      return { label: 'Incandescent Heat / Molten Metal', tier: 'magma', icon: '🌋', color: '#ef4444' };
    }
    return { label: 'Plasma / Stellar Thermosphere (≥5500°C)', tier: 'stellar', icon: '☀️⚡', color: '#ec4899' };
  }
}

module.exports = {
  SCALES,
  ConversionService
};
