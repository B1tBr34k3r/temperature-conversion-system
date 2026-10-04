/**
 * Automated Test Suite for Temperature Conversion System (Milestone 2)
 */
const { InputValidator, TemperatureConverter, ABSOLUTE_ZERO } = require('./converter.js');

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passedCount++;
  } else {
    console.error(`  [FAIL] ${testName}`);
    failedCount++;
  }
}

function assertClose(actual, expected, tolerance = 1e-4, testName) {
  const diff = Math.abs(actual - expected);
  assert(diff <= tolerance, `${testName} (expected ${expected}, got ${actual})`);
}

console.log('==================================================');
console.log('RUNNING MILESTONE 2 CORE MODULE VERIFICATION TESTS');
console.log('==================================================\n');

console.log('TEST SUITE 1: Input Validation & Boundary Checks');
assert(!InputValidator.validate('', 'C').isValid, 'Reject empty string');
assert(!InputValidator.validate('   ', 'F').isValid, 'Reject whitespace string');
assert(!InputValidator.validate('abc', 'C').isValid, 'Reject non-numeric string');
assert(!InputValidator.validate('12.34.56', 'K').isValid, 'Reject malformed decimals');
assert(InputValidator.validate('100', 'C').isValid, 'Accept valid positive integer');
assert(InputValidator.validate('-40.0', 'F').isValid, 'Accept valid negative float');
assert(InputValidator.validate('1e3', 'K').isValid, 'Accept valid scientific notation');

console.log('\nTEST SUITE 2: Absolute Zero Thermodynamic Boundaries');
assert(InputValidator.validate('-273.15', 'C').isValid, 'Accept exact Absolute Zero in Celsius (-273.15°C)');
assert(!InputValidator.validate('-273.16', 'C').isValid, 'Reject below Absolute Zero in Celsius (-273.16°C)');
assert(InputValidator.validate('-459.67', 'F').isValid, 'Accept exact Absolute Zero in Fahrenheit (-459.67°F)');
assert(!InputValidator.validate('-459.68', 'F').isValid, 'Reject below Absolute Zero in Fahrenheit (-459.68°F)');
assert(InputValidator.validate('0', 'K').isValid, 'Accept 0 Kelvin');
assert(!InputValidator.validate('-0.001', 'K').isValid, 'Reject negative Kelvin (-0.001 K)');

console.log('\nTEST SUITE 3: Core Conversion Accuracy & Mathematical Symmetry');
// Standard reference values
assertClose(TemperatureConverter.celsiusToFahrenheit(0), 32.0, 1e-5, '0°C -> 32°F (Freezing point)');
assertClose(TemperatureConverter.celsiusToFahrenheit(100), 212.0, 1e-5, '100°C -> 212°F (Boiling point)');
assertClose(TemperatureConverter.celsiusToFahrenheit(-40), -40.0, 1e-5, '-40°C -> -40°F (Intersection point)');
assertClose(TemperatureConverter.fahrenheitToCelsius(32), 0.0, 1e-5, '32°F -> 0°C');
assertClose(TemperatureConverter.fahrenheitToCelsius(212), 100.0, 1e-5, '212°F -> 100°C');
assertClose(TemperatureConverter.fahrenheitToCelsius(-40), -40.0, 1e-5, '-40°F -> -40°C');

assertClose(TemperatureConverter.celsiusToKelvin(0), 273.15, 1e-5, '0°C -> 273.15 K');
assertClose(TemperatureConverter.celsiusToKelvin(100), 373.15, 1e-5, '100°C -> 373.15 K');
assertClose(TemperatureConverter.kelvinToCelsius(0), -273.15, 1e-5, '0 K -> -273.15°C');
assertClose(TemperatureConverter.kelvinToCelsius(273.15), 0.0, 1e-5, '273.15 K -> 0°C');

assertClose(TemperatureConverter.fahrenheitToKelvin(32), 273.15, 1e-5, '32°F -> 273.15 K');
assertClose(TemperatureConverter.kelvinToFahrenheit(0), -459.67, 1e-2, '0 K -> -459.67°F (Absolute Zero in °F)');

console.log('\nTEST SUITE 4: Round-trip Inversion Symmetry');
const testVal = 77.5;
const roundTripC_F_C = TemperatureConverter.fahrenheitToCelsius(TemperatureConverter.celsiusToFahrenheit(testVal));
assertClose(roundTripC_F_C, testVal, 1e-9, `Round trip C -> F -> C matches initial ${testVal}°C`);

const roundTripC_K_C = TemperatureConverter.kelvinToCelsius(TemperatureConverter.celsiusToKelvin(testVal));
assertClose(roundTripC_K_C, testVal, 1e-9, `Round trip C -> K -> C matches initial ${testVal}°C`);

console.log('\nTEST SUITE 5: Precision Formatter & Floating Point Stability');
const rawVal = 37.77777777777778;
assert(TemperatureConverter.formatPrecision(rawVal, 2) === '37.78', 'Precision 2 places rounding');
assert(TemperatureConverter.formatPrecision(rawVal, 4) === '37.7778', 'Precision 4 places rounding');
assert(TemperatureConverter.formatPrecision(rawVal, 'raw') === rawVal, 'Raw unrounded value');

console.log('\n==================================================');
console.log(`TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED out of ${passedCount + failedCount} total assertions.`);
console.log('==================================================');

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('All Milestone 2 core module verification tests completed successfully!');
}
