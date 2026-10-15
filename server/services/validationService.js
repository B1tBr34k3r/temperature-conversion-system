/**
 * Validation Service (Thermodynamic Limits & Sanity Checker)
 * Milestone 3: Core Module Implementation
 * Authors: Prakhar Harne & Naman Shrivastav
 */

const { SCALES } = require('./conversionService');

class ValidationService {
  /**
   * Validate raw temperature input against mathematical and physical rules
   * @param {any} rawInput 
   * @param {string} scale 
   * @returns {{ isValid: boolean, value?: number, error?: string }}
   */
  static validate(rawInput, scale) {
    if (rawInput === undefined || rawInput === null) {
      return { isValid: false, error: 'Input cannot be null or undefined.' };
    }

    const trimmed = String(rawInput).trim();
    if (trimmed === '') {
      return { isValid: false, error: 'Temperature input field cannot be empty.' };
    }

    // Strict numerical pattern (scientific notation accepted e.g. 1e3, -40.5)
    const numericRegex = /^[+-]?((\d+(\.\d*)?)|(\.\d+))([eE][+-]?\d+)?$/;
    if (!numericRegex.test(trimmed)) {
      return { isValid: false, error: 'Invalid character detected. Value must be a valid numerical constant.' };
    }

    const val = Number(trimmed);
    if (!Number.isFinite(val)) {
      return { isValid: false, error: 'Value must resolve to a finite real number (NaN / Infinity rejected).' };
    }

    // Scale existence check
    const scaleMeta = SCALES[scale];
    if (!scaleMeta) {
      return { isValid: false, error: `Unrecognized temperature scale: '${scale}'.` };
    }

    // Thermodynamic lower bound check (Absolute Zero)
    // Delisle scale is inverted (boiling is 0, absolute zero is +559.725 °De)
    if (scale === 'De') {
      if (val > scaleMeta.absoluteZero + 1e-7) {
        return {
          isValid: false,
          error: `Thermodynamic Limit Violation: Temperature cannot drop below Absolute Zero (${scaleMeta.absoluteZero} ${scaleMeta.symbol}).`
        };
      }
    } else {
      if (val < scaleMeta.absoluteZero - 1e-7) {
        return {
          isValid: false,
          error: `Thermodynamic Limit Violation: Temperature cannot drop below Absolute Zero (${scaleMeta.absoluteZero} ${scaleMeta.symbol}).`
        };
      }
    }

    // Practical astronomical upper limit check (±1e15)
    if (Math.abs(val) > 1e15) {
      return { isValid: false, error: 'Numerical value exceeds safe computational threshold (±10^15).' };
    }

    return { isValid: true, value: val };
  }
}

module.exports = {
  ValidationService
};
