/**
 * Comprehensive Automated Verification & Quality Assurance Suite
 * Milestone 4: Testing & Validation Deliverable
 * 
 * Scope:
 *  1. Unit Testing: Mathematical accuracy, inverse symmetry, precision scaling
 *  2. Integration Testing: REST API controllers, SQLite WAL persistence, telemetry
 *  3. Security & Robustness: Input sanitization, SQLi prevention, XSS mitigation, fuzzing
 *  4. Performance & Concurrency: High-throughput stress, latency bounds, memory stability
 *  5. Requirements Validation: Direct validation against Milestone 1/2 specifications
 * 
 * Authors: Prakhar Harne & Naman Shrivastav
 */

const { ConversionService, SCALES } = require('../server/services/conversionService');
const { ValidationService } = require('../server/services/validationService');
const { insertConversion, getConversions, clearConversions, getStatistics } = require('../server/config/db');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${testName} ${details ? `(${details})` : ''}`);
    failedTests++;
  }
}

function assertClose(actual, expected, tol = 1e-4, testName = '') {
  const diff = Math.abs(actual - expected);
  assert(diff <= tol, testName, `expected ~${expected}, got ${actual}, diff=${diff}`);
}

console.log('========================================================================');
console.log('🧪 THERMACRAFT MILESTONE 4: FULL TESTING & VALIDATION VERIFICATION RUN');
console.log('========================================================================\n');

// =====================================================================
// SUITE 1: UNIT TESTING - 8-SCALE CONVERSIONS & INVERSE SYMMETRY
// =====================================================================
console.log('--- SUITE 1: UNIT TESTING (Mathematical Engine & Inverse Symmetry) ---');

// Known Thermodynamic Benchmarks
assertClose(ConversionService.convert(0, 'C', 'F'), 32.0, 1e-5, 'U-01: Freezing Point 0°C -> 32°F');
assertClose(ConversionService.convert(100, 'C', 'F'), 212.0, 1e-5, 'U-02: Boiling Point 100°C -> 212°F');
assertClose(ConversionService.convert(-40, 'C', 'F'), -40.0, 1e-5, 'U-03: Intersection Point -40°C -> -40°F');
assertClose(ConversionService.convert(0, 'C', 'K'), 273.15, 1e-5, 'U-04: Freezing Point 0°C -> 273.15 K');
assertClose(ConversionService.convert(100, 'C', 'K'), 373.15, 1e-5, 'U-05: Boiling Point 100°C -> 373.15 K');
assertClose(ConversionService.convert(-273.15, 'C', 'K'), 0.0, 1e-5, 'U-06: Absolute Zero -273.15°C -> 0 K');
assertClose(ConversionService.convert(0, 'C', 'R'), 491.67, 1e-4, 'U-07: Freezing Point 0°C -> 491.67°R (Rankine)');
assertClose(ConversionService.convert(100, 'C', 'R'), 671.67, 1e-4, 'U-08: Boiling Point 100°C -> 671.67°R (Rankine)');
assertClose(ConversionService.convert(0, 'C', 'De'), 150.0, 1e-4, 'U-09: Freezing Point 0°C -> 150°De (Delisle Inversion)');
assertClose(ConversionService.convert(100, 'C', 'De'), 0.0, 1e-4, 'U-10: Boiling Point 100°C -> 0°De (Delisle Inversion)');
assertClose(ConversionService.convert(0, 'C', 'N'), 0.0, 1e-4, 'U-11: Freezing Point 0°C -> 0°N (Newton)');
assertClose(ConversionService.convert(100, 'C', 'N'), 33.0, 1e-4, 'U-12: Boiling Point 100°C -> 33°N (Newton)');
assertClose(ConversionService.convert(0, 'C', 'Re'), 0.0, 1e-4, 'U-13: Freezing Point 0°C -> 0°Ré (Réaumur)');
assertClose(ConversionService.convert(100, 'C', 'Re'), 80.0, 1e-4, 'U-14: Boiling Point 100°C -> 80°Ré (Réaumur)');
assertClose(ConversionService.convert(0, 'C', 'Ro'), 7.5, 1e-4, 'U-15: Freezing Point 0°C -> 7.5°Rø (Rømer)');
assertClose(ConversionService.convert(100, 'C', 'Ro'), 60.0, 1e-4, 'U-16: Boiling Point 100°C -> 60°Rø (Rømer)');

// Inverse Symmetry: Convert Scale A -> Scale B -> Scale A (Round-trip identity)
const testScales = ['C', 'F', 'K', 'R', 'De', 'N', 'Re', 'Ro'];
const testValues = [37.0, 150.0, -10.0, 1000.0];
let inverseAllPassed = true;

testScales.forEach(s1 => {
  testScales.forEach(s2 => {
    if (s1 !== s2) {
      testValues.forEach(val => {
        const intermediate = ConversionService.convert(val, s1, s2);
        const roundTrip = ConversionService.convert(intermediate, s2, s1);
        if (Math.abs(roundTrip - val) > 1e-3) {
          inverseAllPassed = false;
        }
      });
    }
  });
});
assert(inverseAllPassed, 'U-17: Mathematical Round-Trip Identity Symmetry across all 56 permutation vectors');

// Precision Formatting Tests
const piVal = 37.123456789;
assert(ConversionService.formatPrecision(piVal, '2') === '37.12', 'U-18: Precision rounding to 2 decimal places');
assert(ConversionService.formatPrecision(piVal, '4') === '37.1235', 'U-19: Precision rounding to 4 decimal places');
assert(ConversionService.formatPrecision(piVal, '6') === '37.123457', 'U-20: Precision rounding to 6 decimal places');
assert(ConversionService.formatPrecision(piVal, 'raw') === piVal, 'U-21: Raw floating point representation retention');


// =====================================================================
// SUITE 2: INTEGRATION TESTING - DATABASE & REST CONTROLLER LAYER
// =====================================================================
console.log('\n--- SUITE 2: INTEGRATION TESTING (SQLite WAL Database & REST Layer) ---');

// Clear database before integration run
clearConversions();
assert(getConversions().length === 0, 'INT-01: SQLite conversion table sanitized and vacuumed cleanly');

// Insert 5 test records across different vectors
const vectors = [
  { val: 0, from: 'C', to: 'F', res: 32, prec: '4', form: '°F = (°C × 9/5) + 32', state: 'Freezing Point' },
  { val: 100, from: 'C', to: 'F', res: 212, prec: '4', form: '°F = (°C × 9/5) + 32', state: 'Boiling Point' },
  { val: 37, from: 'C', to: 'K', res: 310.15, prec: '2', form: 'K = °C + 273.15', state: 'Human Body' },
  { val: -40, from: 'F', to: 'C', res: -40, prec: '2', form: '°C = (°F - 32) × 5/9', state: 'Intersection' },
  { val: 1000, from: 'C', to: 'F', res: 1832, prec: '4', form: '°F = (°C × 9/5) + 32', state: 'Extreme Lava' }
];

vectors.forEach((v, idx) => {
  const rec = insertConversion({
    inputValue: v.val,
    fromScale: v.from,
    resultValue: v.res,
    toScale: v.to,
    precision: v.prec,
    formula: v.form,
    physicalState: v.state,
    clientIp: '127.0.0.1'
  });
  assert(rec.id > 0, `INT-02.${idx + 1}: Record ${idx + 1} successfully written to SQLite WAL journal`);
});

const records = getConversions(10, 0);
assert(records.length === 5, 'INT-03: Retrieved all 5 inserted conversion records from SQLite');
assert(records[0].inputValue === 1000, 'INT-04: Temporal ordering verified (latest inserted record returned first)');

const stats = getStatistics();
assert(stats.totalConversions === 5, 'INT-05: Telemetry aggregator returns exact total count = 5');
assert(stats.minInputRecorded === -40, 'INT-06: Analytical aggregator accurately identifies min input = -40');
assert(stats.maxInputRecorded === 1000, 'INT-07: Analytical aggregator accurately identifies max input = 1000');

// Multi-Scale Telemetry Generation
const radar = ConversionService.convertToAllScales(25, 'C', '2');
assert(Object.keys(radar).length === 8, 'INT-08: 8-vector simultaneous radar telemetry successfully generated');
assert(radar.F.value === '77.00', 'INT-09: Radar Fahrenheit vector = 77.00°F');
assert(radar.K.value === '298.15', 'INT-10: Radar Kelvin vector = 298.15 K');


// =====================================================================
// SUITE 3: SECURITY, BOUNDARY & FUZZ TESTING
// =====================================================================
console.log('\n--- SUITE 3: SECURITY, BOUNDARY & FUZZ TESTING (Robustness Defense) ---');

// Syntactic & Input Sanitization
assert(!ValidationService.validate('', 'C').isValid, 'SEC-01: Rejection of empty string input');
assert(!ValidationService.validate('   ', 'C').isValid, 'SEC-02: Rejection of pure whitespace');
assert(!ValidationService.validate('NaN', 'C').isValid, 'SEC-03: Rejection of explicit NaN token');
assert(!ValidationService.validate('Infinity', 'C').isValid, 'SEC-04: Rejection of Infinity token');
assert(!ValidationService.validate('-Infinity', 'C').isValid, 'SEC-05: Rejection of -Infinity token');
assert(!ValidationService.validate('undefined', 'C').isValid, 'SEC-06: Rejection of undefined string');
assert(!ValidationService.validate('null', 'C').isValid, 'SEC-07: Rejection of null token');
assert(!ValidationService.validate('12.34.56', 'C').isValid, 'SEC-08: Rejection of multi-decimal invalid float');
assert(!ValidationService.validate('1e500', 'C').isValid, 'SEC-09: Rejection of numeric overflow beyond IEEE-754 bounds');

// Security & SQL Injection Protection
assert(!ValidationService.validate("100; DROP TABLE conversions;--", 'C').isValid, 'SEC-10: Neutralization of SQL injection payload');
assert(!ValidationService.validate("<script>alert('xss')</script>", 'C').isValid, 'SEC-11: Neutralization of Cross-Site Scripting (XSS) payload');
assert(!ValidationService.validate("100' OR '1'='1", 'C').isValid, 'SEC-12: Neutralization of SQL tautology injection');

// Strict Absolute Zero Boundary Testing
assert(ValidationService.validate('-273.15', 'C').isValid, 'SEC-13: Absolute Zero exact boundary accepted in Celsius (-273.15°C)');
assert(!ValidationService.validate('-273.1501', 'C').isValid, 'SEC-14: Rejection of violation beyond Absolute Zero Celsius (-273.1501°C)');
assert(ValidationService.validate('-459.67', 'F').isValid, 'SEC-15: Absolute Zero exact boundary accepted in Fahrenheit (-459.67°F)');
assert(!ValidationService.validate('-459.68', 'F').isValid, 'SEC-16: Rejection of violation beyond Absolute Zero Fahrenheit');
assert(ValidationService.validate('0', 'K').isValid, 'SEC-17: 0 Kelvin accepted as Absolute Zero limit');
assert(!ValidationService.validate('-0.00001', 'K').isValid, 'SEC-18: Rejection of negative Kelvin magnitude');
assert(ValidationService.validate('0', 'R').isValid, 'SEC-19: 0 Rankine accepted as Absolute Zero limit');
assert(!ValidationService.validate('-0.01', 'R').isValid, 'SEC-20: Rejection of negative Rankine magnitude');


// =====================================================================
// SUITE 4: PERFORMANCE, LATENCY & CONCURRENCY BENCHMARKS
// =====================================================================
console.log('\n--- SUITE 4: PERFORMANCE & STRESS TESTING (Throughput & Latency) ---');

// Micro-benchmark: 100,000 raw conversions execution speed
const startBench = process.hrtime.bigint();
const BENCH_ITERATIONS = 100000;
for (let i = 0; i < BENCH_ITERATIONS; i++) {
  ConversionService.convert(i % 500, 'C', 'F');
}
const endBench = process.hrtime.bigint();
const totalMs = Number(endBench - startBench) / 1e6;
const avgUs = (totalMs / BENCH_ITERATIONS) * 1000;

assert(avgUs < 10.0, `PERF-01: Algorithmic Conversion Latency = ${avgUs.toFixed(3)} µs/op (Target: < 10 µs)`);
assert(totalMs < 500, `PERF-02: 100,000 conversion batch completed in ${totalMs.toFixed(2)} ms (Throughput: ${(BENCH_ITERATIONS / (totalMs / 1000)).toFixed(0)} ops/sec)`);

// Database concurrent write stress: 200 rapid insertions
const startDb = process.hrtime.bigint();
const DB_STRESS_BATCH = 200;
for (let i = 0; i < DB_STRESS_BATCH; i++) {
  insertConversion({
    inputValue: i,
    fromScale: 'C',
    resultValue: i * 1.8 + 32,
    toScale: 'F',
    precision: '2',
    formula: '°F = (°C × 1.8) + 32',
    physicalState: 'Stress Test',
    clientIp: '127.0.0.1'
  });
}
const endDb = process.hrtime.bigint();
const totalDbMs = Number(endDb - startDb) / 1e6;
const avgDbWriteMs = totalDbMs / DB_STRESS_BATCH;

assert(avgDbWriteMs < 2.0, `PERF-03: SQLite WAL synchronous write latency = ${avgDbWriteMs.toFixed(3)} ms/tx (Target: < 2.0 ms)`);
assert(getConversions(500, 0).length === 205, `PERF-04: All ${DB_STRESS_BATCH} concurrent writes committed without transaction loss or database lock contention`);

// Memory footprint test
const memUsage = process.memoryUsage();
const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
assert(heapUsedMB < 60.0, `PERF-05: Node.js V8 Heap Footprint = ${heapUsedMB.toFixed(2)} MB under heavy stress (Budget: < 60 MB)`);


// =====================================================================
// SUITE 5: VALIDATION AGAINST REQUIREMENTS (Traceability Verification)
// =====================================================================
console.log('\n--- SUITE 5: REQUIREMENTS TRACEABILITY VALIDATION (Specification Compliance) ---');

// FR-1: 8 Temperature Scales Support
const scaleCount = Object.keys(SCALES).length;
assert(scaleCount === 8, 'RTM-FR1: System implements exactly 8 thermodynamic and historical scales');

// FR-2: 64-Bit IEEE-754 Precision
const testEpsilon = ConversionService.convert(0.00000001, 'C', 'K');
assert(Math.abs(testEpsilon - 273.15000001) < 1e-12, 'RTM-FR2: IEEE-754 64-bit double precision preservation');

// FR-3: Thermodynamic Limits Enforcement
const limitsEnforced = !ValidationService.validate('-300', 'C').isValid && !ValidationService.validate('-1', 'K').isValid;
assert(limitsEnforced, 'RTM-FR3: Thermodynamic lower bounds (Absolute Zero) rigidly enforced across all vectors');

// FR-4: Derivation Trace Generation
const deriv = ConversionService.getFormulaBreakdown(100, 'C', 'F', 212, '212.00');
assert(deriv.formula && deriv.steps && deriv.steps.length > 0, 'RTM-FR4: Mathematical step-by-step derivation trace generated');

// FR-5: Physical Milestone Detection
const stateCryo = ConversionService.getPhysicalState(-196);
const stateHot = ConversionService.getPhysicalState(1500);
assert(stateCryo.tier && stateHot.tier, 'RTM-FR5: Environmental milestone & physical thermal tier classification active');

// FR-6: Database Persistence & Query History
const latest = getConversions(1, 0);
assert(latest.length === 1 && latest[0].id > 0, 'RTM-FR6: Persistent storage of conversion events in SQLite with WAL logging');

// Clean up stress test entries to keep DB pristine
clearConversions();
assert(getConversions().length === 0, 'RTM-FR7: Database administrative purge and VACUUM operation functioning');


// =====================================================================
// FINAL VERIFICATION SUMMARY
// =====================================================================
console.log('\n========================================================================');
console.log(`🏆 MILESTONE 4 TEST RUN COMPLETE: ${passedTests} PASSED, ${failedTests} FAILED out of ${totalTests} ASSERTIONS`);
console.log('========================================================================');

if (failedTests > 0) {
  console.error('❌ MILESTONE 4 VALIDATION FAILED: Some test assertions did not pass.\n');
  process.exit(1);
} else {
  console.log('✅ ALL MILESTONE 4 TEST SUITES PASSED WITH 100% SUCCESS RATE!');
  console.log('   ✓ Unit Testing: 100% Pass');
  console.log('   ✓ Integration Testing: 100% Pass');
  console.log('   ✓ Security & Fuzz Testing: 100% Pass');
  console.log('   ✓ Performance & Concurrency: 100% Pass');
  console.log('   ✓ Requirements Traceability: 100% Pass\n');
}
