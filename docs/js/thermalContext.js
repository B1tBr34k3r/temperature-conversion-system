/**
 * Thermal Discovery & Molecular Kinetics Engine
 * Calculates real physical thermal kinetics and dynamic scientific trivia:
 * - Molecular kinetic velocity (v_rms of air molecules in m/s & km/h)
 * - Dual-scale conversion ratio and zero-shift bridge
 * - Dynamic scientific & historical discovery trivia
 * Authors: Prakhar Harne & Naman Shrivastav
 */

class ThermalDiscoveryEngine {
  /**
   * Calculate root-mean-square molecular velocity (v_rms) for atmospheric air (N2/O2 mix)
   * Formula: v_rms = sqrt(3 * R * T / M) where M = 0.02897 kg/mol, R = 8.3145 J/(mol*K)
   */
  static getMolecularSpeed(celsius) {
    const kelvin = Math.max(0, celsius + 273.15);
    if (kelvin === 0) {
      return {
        mps: 0,
        kmh: 0,
        mach: '0.0',
        label: '0 m/s',
        subLabel: 'Absolute zero (molecular motion ceases)'
      };
    }

    // 3 * 8.3145 / 0.02897 = ~861.01
    const vMps = Math.sqrt(861.01 * kelvin);
    const vKmh = vMps * 3.6;
    const mach = (vMps / 343).toFixed(1);

    return {
      mps: Math.round(vMps),
      kmh: Math.round(vKmh).toLocaleString(),
      mach: mach,
      label: `${Math.round(vMps)} m/s`,
      subLabel: `~${Math.round(vKmh).toLocaleString()} km/h (Mach ${mach})`
    };
  }

  /**
   * Calculate alignment ruler percentages and ratio bridge metadata
   */
  static getBridgeMetadata(fromScale, toScale, fromVal, toVal) {
    const fVal = parseFloat(fromVal) || 0;
    const tVal = parseFloat(toVal) || 0;

    // Formulas and unit ratios
    let ratioText = '1:1 ratio';
    let formulaChip = 'Direct translation';

    if (fromScale === 'C' && toScale === 'F') {
      ratioText = '1°C = 1.8000°F (9/5)';
      formulaChip = '°F = (°C × 1.8) + 32';
    } else if (fromScale === 'F' && toScale === 'C') {
      ratioText = '1°F = 0.5556°C (5/9)';
      formulaChip = '°C = (°F - 32) ÷ 1.8';
    } else if (fromScale === 'C' && toScale === 'K') {
      ratioText = '1°C = 1.0000 K (1:1)';
      formulaChip = 'K = °C + 273.15';
    } else if (fromScale === 'K' && toScale === 'C') {
      ratioText = '1 K = 1.0000°C (1:1)';
      formulaChip = '°C = K - 273.15';
    } else if (fromScale === 'F' && toScale === 'K') {
      ratioText = '1°F = 0.5556 K';
      formulaChip = 'K = (°F - 32) × 5/9 + 273.15';
    } else if (fromScale === 'K' && toScale === 'F') {
      ratioText = '1 K = 1.8000°F';
      formulaChip = '°F = (K - 273.15) × 1.8 + 32';
    } else {
      ratioText = `Multi-Scale Translation (${fromScale} → ${toScale})`;
      formulaChip = `${toScale} = ƒ(${fromScale})`;
    }

    // Normalized ruler marker position (clamped 4% to 96%)
    // Normalized around common human-experienced range: -50 to 250
    const fromClamped = Math.max(-50, Math.min(250, fVal));
    const fromPct = 4 + ((fromClamped - (-50)) / 300) * 92;

    const toClamped = Math.max(-50, Math.min(482, tVal));
    const toPct = 4 + ((toClamped - (-50)) / 532) * 92;

    return {
      ratioText,
      formulaChip,
      fromPct: Math.max(4, Math.min(96, fromPct)),
      toPct: Math.max(4, Math.min(96, toPct))
    };
  }

  /**
   * Dynamic curiosity trivia based on thermodynamic temperature bracket
   */
  static getCuriosityTrivia(celsius) {
    if (celsius <= -200) {
      return {
        tag: 'CRYOGENIC PHYSICS',
        text: 'At -196°C, atmospheric nitrogen turns into a boiling liquid. Oxygen condenses into a pale magnetic blue fluid at -183°C!'
      };
    }
    if (celsius <= -45) {
      return {
        tag: 'SOLID-STATE THERMAL',
        text: 'Dry ice (solid carbon dioxide) sublimates straight from solid into gas at -78.5°C without ever melting into a liquid at normal pressure.'
      };
    }
    if (celsius <= -35) {
      return {
        tag: 'MATHEMATICAL HARMONY',
        text: '-40° is the magic number where Celsius and Fahrenheit scales are completely identical: exactly -40°C = -40°F.'
      };
    }
    if (celsius <= 0) {
      return {
        tag: 'SUPERCOOLING SECRETS',
        text: 'Ultra-pure water lacking airborne dust particles can stay liquid down to -40°C before flash-crystallizing into solid ice within milliseconds.'
      };
    }
    if (celsius <= 10) {
      return {
        tag: 'WATER DENSITY ANOMALY',
        text: 'Water reaches its peak density at exactly 4.0°C (39.2°F). Because of this, ice floats and lakes freeze top-down, keeping aquatic life alive at the bottom!'
      };
    }
    if (celsius <= 26) {
      return {
        tag: 'HISTORICAL DISCOVERY',
        text: 'In 1742, Anders Celsius originally made 0° the boiling point of water and 100° the freezing point! Carl Linnaeus inverted it after Celsius passed away.'
      };
    }
    if (celsius <= 42) {
      return {
        tag: 'BIOLOGICAL METABOLISM',
        text: 'A resting human body constantly burns cellular energy to maintain 37°C (98.6°F), radiating ~100 Watts of thermal power—just like a vintage light bulb!'
      };
    }
    if (celsius <= 75) {
      return {
        tag: 'MOLECULAR GASTRONOMY',
        text: 'At 62°C, egg-white ovotransferrin protein denatures into soft custard, whereas the rich yolk proteins stay silky and runny until reaching 68°C.'
      };
    }
    if (celsius <= 130) {
      return {
        tag: 'ATMOSPHERIC PRESSURE',
        text: 'While water boils at 100°C at sea level, on the summit of Mount Everest (8,848m), thin air pressure drops the boiling point to just 68°C (154°F)!'
      };
    }
    if (celsius <= 220) {
      return {
        tag: 'THE MAILLARD REACTION',
        text: 'Between 140°C and 165°C, sugars and amino acids chemically recombine, creating the savory aromatic crusts on baked bread, pizza, and roasted coffee.'
      };
    }
    return {
      tag: 'INCANDESCENT RADIATION',
      text: 'Above 525°C (the Draper point), all solid objects begin emitting visible thermal radiation, glowing from faint cherry-red up to brilliant white!'
    };
  }
}

window.ThermalDiscoveryEngine = ThermalDiscoveryEngine;
