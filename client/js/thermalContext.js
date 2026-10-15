/**
 * Thermal Discovery & Heat Intensity Engine
 * Calculates pure temperature-related physical metrics and dynamic scientific trivia:
 * - Heat Intensity Level (Water scale percentage, boiling multiplier, and baseline distance)
 * - Dual-scale conversion ratio and zero-shift bridge
 * - Dynamic scientific & historical discovery trivia
 * Authors: Prakhar Harne & Naman Shrivastav
 */

class ThermalDiscoveryEngine {
  /**
   * Natural & Cosmic Thermal Twin Engine
   * Dynamically pairs any temperature with its real-world physical, planetary,
   * or cosmic environment counterpart across nature and science.
   */
  static getThermalTwin(celsius) {
    const kelvin = Math.max(0, celsius + 273.15);

    if (celsius <= -270) {
      return {
        icon: '🌌',
        name: 'Boomerang Nebula & Cosmic Void',
        badge: 'Coldest Natural Place',
        phase: '⚡ Absolute Zero Floor (1 K)',
        desc: `At ${kelvin.toFixed(1)} K, rapidly expanding gases make this nebula colder than the cosmic microwave background (2.7 K).`
      };
    }
    if (celsius <= -180) {
      return {
        icon: '🪐',
        name: 'Titan & Pluto Cryogenic Seas',
        badge: 'Outer Solar System',
        phase: '❄️ Liquid Nitrogen & Methane',
        desc: `At ${celsius.toFixed(0)}°C, nitrogen condenses into tranquil liquid rivers across Saturn's moon Titan beneath an orange organic haze.`
      };
    }
    if (celsius <= -80) {
      return {
        icon: '❄️',
        name: 'Vostok Station, Antarctica',
        badge: 'Earth Surface Record',
        phase: '🧊 Brittle Hexagonal Ice Matrix',
        desc: 'Recorded at -89.2°C in 1983. Human breath freezes mid-air with an audible whisper called "the whisper of the stars".'
      };
    }
    if (celsius <= -35) {
      return {
        icon: '🏔️',
        name: 'Siberian Oymyakon / Yakutsk',
        badge: 'Inhabited Frozen Frontier',
        phase: '🧊 Solid Sub-Zero Permafrost',
        desc: 'At -40°C (= -40°F), metal bonds to skin, vehicle engines run 24/7, and thrown boiling water instantly flashes into snow.'
      };
    }
    if (celsius < 0) {
      return {
        icon: '🍦',
        name: 'Glacial Crevasse & Deep Freeze',
        badge: 'Terrestrial Cryosphere',
        phase: '🧊 Rigid Crystalline Ice',
        desc: `At ${celsius.toFixed(1)}°C, liquid water locks into crystal lattices, halting bacterial decay and forming continental glaciers.`
      };
    }
    if (celsius === 0) {
      return {
        icon: '🧊',
        name: 'Glacial Melt & Ice Equilibrium',
        badge: 'Thermodynamic Baseline',
        phase: '⚖️ Zero Phase-Shift Line',
        desc: 'The exact physical boundary where ice absorbs 334 J/g latent heat to liquefy. Calibrated as 0° on the Celsius metric scale.'
      };
    }
    if (celsius <= 15) {
      return {
        icon: '🌲',
        name: 'Limestone Cave & Wine Cellar',
        badge: 'Subterranean Ambient',
        phase: '💧 Dense Liquid Condensate',
        desc: `At ${celsius.toFixed(1)}°C, deep limestone caves stay constant year-round, historically used across Europe for aging cheeses and wines.`
      };
    }
    if (celsius <= 26) {
      return {
        icon: '🌸',
        name: 'Temperate Earth Biosphere',
        badge: 'Golden Living Zone',
        phase: '✨ Ideal Biological Equilibrium',
        desc: `At ${celsius.toFixed(1)}°C (${((celsius * 1.8) + 32).toFixed(1)}°F), this is the optimal sweet spot for human comfort, photosynthesis, and liquid water vitality.`
      };
    }
    if (celsius <= 42) {
      return {
        icon: '🫀',
        name: 'Living Mammalian Warm Core',
        badge: 'Homeostatic Metabolism',
        phase: '🧬 Active Folded Enzymes',
        desc: `At ${celsius.toFixed(1)}°C, warm-blooded enzymes fold with nanometer precision. A rise past 42°C triggers cellular heat-shock.`
      };
    }
    if (celsius <= 60) {
      return {
        icon: '🏜️',
        name: 'Death Valley Furnace Creek',
        badge: 'Earth Record Heatwave',
        phase: '☀️ Scorching Arid Atmosphere',
        desc: 'Earth ambient air peaked at 56.7°C (134°F) in 1913. Ground surface rocks easily soar past 90°C, hot enough to cook food.'
      };
    }
    if (celsius <= 85) {
      return {
        icon: '☕',
        name: 'Yellowstone Prismatic Springs',
        badge: 'Hydrothermal Extremophiles',
        phase: '♨️ Near-Boiling Convection',
        desc: `At ${celsius.toFixed(1)}°C, vibrant hyperthermal archaea thrive. Also marks the optimal temperature to brew artisan coffee without scorching.`
      };
    }
    if (celsius <= 100) {
      return {
        icon: '♨️',
        name: 'Sea-Level Steam Transition',
        badge: 'Water Boiling Frontier',
        phase: '🔥 1,600× Steam Vaporization',
        desc: `At ${celsius.toFixed(1)}°C (1 atm), water expands 1,600 times into steam—the thermodynamic driver of the Industrial Revolution.`
      };
    }
    if (celsius <= 250) {
      return {
        icon: '🍕',
        name: 'Wood Pizza Hearth & Mercury Dusk',
        badge: 'Kiln Pyrolysis & Planet Crust',
        phase: '🔥 Maillard Crust Caramelization',
        desc: `At ${celsius.toFixed(1)}°C (${((celsius * 1.8) + 32).toFixed(1)}°F), sugars and amino acids crisp pizza crusts; matches dusk regolith on planet Mercury.`
      };
    }
    if (celsius <= 500) {
      return {
        icon: '🪐',
        name: 'Crushing Surface of Planet Venus',
        badge: 'Planetary Greenhouse Hell',
        phase: '🧪 Molten Lead & Tin Pools',
        desc: `At ${celsius.toFixed(1)}°C under 90 atm of CO₂, rocks glow faint red in darkness and metallic lead puddles naturally on the surface.`
      };
    }
    if (celsius <= 1300) {
      return {
        icon: '🌋',
        name: 'Kilauea Basaltic Lava Flow',
        badge: 'Molten Mantle Silicate',
        phase: '🌋 Glowing Orange-Yellow Magma',
        desc: `Basalt erupts at ${celsius.toFixed(0)}°C, glowing orange-yellow and paving new continental crust directly on tectonic plate edges.`
      };
    }
    if (celsius <= 2000) {
      return {
        icon: '🏭',
        name: 'Industrial Blast Smelting Furnace',
        badge: 'Metallurgic Smelting Point',
        phase: '⚡ Liquefied White-Hot Iron',
        desc: `At ${celsius.toFixed(0)}°C, pure iron breaks its crystalline lattice into dazzling white molten liquid for industrial steel fabrication.`
      };
    }
    return {
      icon: '☀️',
      name: 'Solar Photosphere Surface',
      badge: 'Stellar Plasma Fusion',
      phase: '⚡ Ionized Incandescent Plasma',
      desc: `At ${celsius.toFixed(0)}°C (${kelvin.toFixed(0)} K), atoms shed electrons into incandescent plasma, radiating the yellow light powering our solar system.`
    };
  }

  /**
   * Backward compatibility alias
   */
  static getHeatIntensity(celsius) {
    return this.getThermalTwin(celsius);
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
