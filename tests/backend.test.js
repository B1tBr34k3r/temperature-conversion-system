/**
 * Backend & Full Integration Test Suite
 * Milestone 3: Automated Verification
 * Authors: Prakhar Harne & Naman Shrivastav
 */

const { ConversionService, SCALES } = require('../server/services/conversionService');
const { ValidationService } = require('../server/services/validationService');
const { insertConversion, getConversions, clearConversions, getStatistics } = require('../server/config/db');

let pass = 0;
let fail = 0;

function assert(condition, desc) {
  if (condition) {
    console.log(`  [PASS] ${desc}`);
    pass++;
  } else {
    console.error(`  [FAIL] ${desc}`);
    fail++;
  }
}

function assertClose(actual, expected, tol = 1e-4, desc = '') {
  const diff = Math.abs(actual - expected);
  assert(diff <= tol, `${desc} (expected ~${expected}, got ${actual})`);
}

console.log('========================================================');
console.log('⚡ MILESTONE 3: BACKEND, DATABASE & INTEGRATION TEST RUN');
console.log('========================================================\n');

// -----------------------------------------------------------------
// 1. ALL 8 TEMPERATURE SCALES MATHEMATICAL ACCURACY
// -----------------------------------------------------------------
console.log('SUITE 1: 8-Scale Conversion Mathematical Verification');

// Celsius <-> Fahrenheit
assertClose(ConversionService.convert(0, 'C', 'F'), 32.0, 1e-5, '0°C -> 32°F Freezing Point');
assertClose(ConversionService.convert(100, 'C', 'F'), 212.0, 1e-5, '100°C -> 212°F Boiling Point');
assertClose(ConversionService.convert(-40, 'C', 'F'), -40.0, 1e-5, '-40°C -> -40°F Intersection Point');

// Celsius <-> Kelvin
assertClose(ConversionService.convert(0, 'C', 'K'), 273.15, 1e-5, '0°C -> 273.15 K Freezing Point');
assertClose(ConversionService.convert(100, 'C', 'K'), 373.15, 1e-5, '100°C -> 373.15 K Boiling Point');
assertClose(ConversionService.convert(-273.15, 'C', 'K'), 0.0, 1e-5, '-273.15°C -> 0 K Absolute Zero');

// Rankine (°R)
assertClose(ConversionService.convert(0, 'C', 'R'), 491.67, 1e-4, '0°C -> 491.67°R');
assertClose(ConversionService.convert(100, 'C', 'R'), 671.67, 1e-4, '100°C -> 671.67°R');

// Delisle (°De) - inverted scale
assertClose(ConversionService.convert(0, 'C', 'De'), 150.0, 1e-4, '0°C -> 150°De');
assertClose(ConversionService.convert(100, 'C', 'De'), 0.0, 1e-4, '100°C -> 0°De (Boiling)');

// Newton (°N)
assertClose(ConversionService.convert(0, 'C', 'N'), 0.0, 1e-4, '0°C -> 0°N');
assertClose(ConversionService.convert(100, 'C', 'N'), 33.0, 1e-4, '100°C -> 33°N');

// Réaumur (°Ré)
assertClose(ConversionService.convert(0, 'C', 'Re'), 0.0, 1e-4, '0°C -> 0°Ré');
assertClose(ConversionService.convert(100, 'C', 'Re'), 80.0, 1e-4, '100°C -> 80°Ré');

// Rømer (°Rø)
assertClose(ConversionService.convert(0, 'C', 'Ro'), 7.5, 1e-4, '0°C -> 7.5°Rø');
assertClose(ConversionService.convert(100, 'C', 'Ro'), 60.0, 1e-4, '100°C -> 60°Rø');

// -----------------------------------------------------------------
// 2. INPUT VALIDATION & THERMODYNAMIC LIMITS
// -----------------------------------------------------------------
console.log('\nSUITE 2: Thermodynamic & Syntactic Validation');

assert(ValidationService.validate('100', 'C').isValid, 'Accept valid positive integer');
assert(ValidationService.validate('-40.5', 'F').isValid, 'Accept valid negative decimal');
assert(!ValidationService.validate('', 'C').isValid, 'Reject empty string');
assert(!ValidationService.validate('   ', 'C').isValid, 'Reject whitespace');
assert(!ValidationService.validate('abc', 'C').isValid, 'Reject non-numeric input');
assert(!ValidationService.validate('12.34.56', 'K').isValid, 'Reject malformed decimals');

// Thermodynamic absolute zero tests
assert(ValidationService.validate('-273.15', 'C').isValid, 'Accept exact Absolute Zero Celsius');
assert(!ValidationService.validate('-273.16', 'C').isValid, 'Reject below Absolute Zero Celsius');
assert(ValidationService.validate('0', 'K').isValid, 'Accept 0 Kelvin');
assert(!ValidationService.validate('-0.001', 'K').isValid, 'Reject negative Kelvin');
assert(ValidationService.validate('0', 'R').isValid, 'Accept 0 Rankine');
assert(!ValidationService.validate('-1', 'R').isValid, 'Reject negative Rankine');

// -----------------------------------------------------------------
// 3. DATABASE CRUD & PERSISTENCE
// -----------------------------------------------------------------
console.log('\nSUITE 3: SQLite Database Operations & Persistence');

// Clear existing test records
clearConversions();
assert(getConversions().length === 0, 'Database cleared cleanly');

// Insert Record 1
const rec1 = insertConversion({
  inputValue: 100,
  fromScale: 'C',
  resultValue: 212,
  toScale: 'F',
  precision: '4',
  formula: '°F = (°C × 9/5) + 32',
  physicalState: 'Boiling Point',
  clientIp: '127.0.0.1'
});
assert(rec1.id > 0, `Record 1 inserted with ID: ${rec1.id}`);

// Insert Record 2
const rec2 = insertConversion({
  inputValue: 0,
  fromScale: 'C',
  resultValue: 273.15,
  toScale: 'K',
  precision: '4',
  formula: 'K = °C + 273.15',
  physicalState: 'Freezing Point',
  clientIp: '127.0.0.1'
});
assert(rec2.id > 0, `Record 2 inserted with ID: ${rec2.id}`);

// Fetch and verify records
const history = getConversions();
assert(history.length === 2, `Retrieved exactly 2 records from SQLite`);
assert(history[0].inputValue === 0 && history[0].toScale === 'K', 'Latest record ordered first');
assert(history[1].inputValue === 100 && history[1].toScale === 'F', 'Second record correctly stored');

// Statistics
const stats = getStatistics();
assert(stats.totalConversions === 2, `Stats returns totalConversions = 2`);
assert(stats.minInputRecorded === 0 && stats.maxInputRecorded === 100, `Stats accurately calculates min & max inputs`);

// -----------------------------------------------------------------
// 4. MULTI-SCALE TELEMETRY & PHYSICAL MILESTONES
// -----------------------------------------------------------------
console.log('\nSUITE 4: Multi-Scale Telemetry & Milestone Detection');

const telemetry = ConversionService.convertToAllScales(100, 'C', '2');
assert(Object.keys(telemetry).length === 8, 'Full 8-scale telemetry generated');
assert(telemetry.F.value === '212.00', 'Telemetry Fahrenheit = 212.00');
assert(telemetry.K.value === '373.15', 'Telemetry Kelvin = 373.15');
assert(telemetry.R.value === '671.67', 'Telemetry Rankine = 671.67');
assert(telemetry.De.value === '0.00', 'Telemetry Delisle = 0.00');

const stateAbsZero = ConversionService.getPhysicalState(-273.15);
assert(stateAbsZero.tier === 'cryo-core', 'Identified Absolute Zero tier');

const stateBoiling = ConversionService.getPhysicalState(100);
assert(stateBoiling.tier === 'thermal-high', 'Identified Boiling Point tier');

// -----------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------
console.log('\n========================================================');
console.log(`TEST SUMMARY: ${pass} PASSED, ${fail} FAILED out of ${pass + fail} assertions.`);
console.log('========================================================');

if (fail > 0) {
  process.exit(1);
} else {
  console.log('All Milestone 3 backend and database tests completed with 100% success!\n');
}
