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
   * Practical Living & Everyday Comfort Advisor
   * Translates any temperature into actionable, real-world human advice:
   * What it feels like, recommended clothing/safety, and practical everyday tips.
   */
  /**
   * Everyday Matter & Substance Scanner
   * Simulates in real-time how everyday things transform at this exact temperature:
   * 1. 🍫 Chocolate & Butter (solid snap, softening, or melting puddle)
   * 2. 📱 Smartphone & Battery (lithium efficiency, cold drain, or thermal shutdown)
   * 3. 💧 Water & Physical State (ice crystals, fluid, or 1,600x steam expansion)
   * 4. 🍳 Food & Kitchen Chemistry (freezing, yeast proofing, egg proteins, or Maillard browning)
   * Plus a fascinating everyday thermal science insight!
   */
  static getEverydayMatterState(celsius) {
    const c = typeof celsius === 'number' ? (isNaN(celsius) ? 0 : celsius) : (parseFloat(celsius) || 0);

    if (c <= -20) {
      return {
        icon: '🧊',
        badge: 'DEEP CRYOGENIC FREEZE',
        headline: 'Extreme Cold: Shatterable Solids & Frozen Battery',
        chocolate: 'Rock-hard & brittle; shatters like glass',
        phone: 'Severe cold-drain: drops 40%+ instantly; LCD lags',
        water: 'Glacial crystalline ice block',
        food: 'Microbial activity completely halted; safe indefinitely',
        tip: '💡 In extreme sub-zero weather, lithium-ion chemical reactions slow down so drastically that phones shut down even when battery shows 50%!'
      };
    }
    if (c < 0) {
      return {
        icon: '❄️',
        badge: 'SUB-ZERO FREEZING',
        headline: 'Freezer Cold: Frozen Ice & Hardened Butter',
        chocolate: 'Chilled firm; butter impossible to spread',
        phone: 'Chassis icy; battery drains ~20% faster than normal',
        water: 'Solid ice; puddles and sidewalks freeze solid',
        food: 'Standard home freezer range (-18°C); preserves groceries',
        tip: '💡 Commercial ice cream freezers stay strictly at -18°C (0°F)—cold enough to stop bacterial replication without creating crunchy ice shards.'
      };
    }
    if (Math.abs(c) < 0.1) {
      return {
        icon: '🧊',
        badge: '0°C PHASE EQUILIBRIUM',
        headline: 'The Freezing Threshold: Ice Meets Water',
        chocolate: 'Hard cold snap; butter requires pre-warming',
        phone: 'Chilled battery; safe operation, avoid moisture condensation',
        water: 'Exact thermodynamic boundary: liquid water turns to ice',
        food: 'Refrigerator baseline: keeps dairy fresh without freezing milk',
        tip: '💡 Water is one of the only liquids on Earth that expands when freezing (becoming 9% less dense), which is why ice floats and preserves life beneath frozen lakes!'
      };
    }
    if (c <= 15) {
      return {
        icon: '🍂',
        badge: 'CHILLED CRISP CLIMATE',
        headline: 'Chilly Climate: Crisp Solids & Slow Ferment',
        chocolate: 'Firm butter; crisp chocolate snap with zero melting',
        phone: 'Cool optimal operation; zero thermal throttling risk',
        water: 'Refreshing cold drinking liquid',
        food: 'Natural pantry preserve; slow yeast and sourdough proof',
        tip: '💡 Extra virgin olive oil naturally turns cloudy and thick below 10°C (50°F) because its healthy fatty acids solidify before water does!'
      };
    }
    if (c <= 25) {
      return {
        icon: '🛋️',
        badge: 'OPTIMAL LIVING EQUILIBRIUM',
        headline: 'Golden Comfort: Spreadable Butter & Peak Tech',
        chocolate: 'Butter is perfectly soft & spreadable; chocolate snaps dry',
        phone: '100% peak battery lifespan and CPU processing speed',
        water: 'Comfortable room-temperature drinking fluid',
        food: 'Bread yeast proofs smoothly; red wine optimum aroma',
        tip: '💡 20°C–22°C (68°F–72°F) is the international laboratory standard because common household materials neither melt, sweat, nor freeze in this zone.'
      };
    }
    if (c <= 33) {
      return {
        icon: '☀️',
        badge: 'WARM SUMMER WARMTH',
        headline: 'Summer Warmth: Softening Fats & Rising Heat',
        chocolate: 'Butter begins melting into oil; chocolate softens on touch',
        phone: 'Chassis warm; battery charges slower to prevent degradation',
        water: 'Warm tepid water; high natural evaporation',
        food: 'Rapid dough rising; milk and dairy spoil quickly if left out',
        tip: '💡 Coconut oil has a precise melting point at 24°C (76°F)—it stays a firm white spread in winter, but liquefies into a clear golden oil in summer!'
      };
    }
    if (c <= 39) {
      return {
        icon: '🍫',
        badge: 'BODY & CHOCOLATE MELT',
        headline: '34°C–37°C: Chocolate Melts & Body Equilibrium',
        chocolate: 'Chocolate liquefies in hand (melts at 34°C); butter is yellow oil',
        phone: 'Thermal throttling kicks in; brightness dims to reduce heat',
        water: 'Warm bath temperature; matching human internal core',
        food: 'Lukewarm water optimal for yeast bloom (hotter kills it)',
        tip: '💡 Cocoa butter is chemically unique: it melts at exactly 34°C (93°F)—just 3°C below human body heat—creating chocolate\'s signature "melts on your tongue" sensation!'
      };
    }
    if (c <= 70) {
      return {
        icon: '🚿',
        badge: 'SCALDING HOT LIQUID',
        headline: 'Hot Liquids: Protein Denaturation & Scalds',
        chocolate: 'Melted liquid fondue; separated cocoa butter',
        phone: 'Overheating warning! Auto-lockdown to prevent battery bulge',
        water: 'Steamy domestic hot water; scalds skin in 3 seconds at 60°C',
        food: 'Egg whites set into soft custard at 62°C (delicate sous-vide)',
        tip: '💡 In gourmet cooking, egg whites coagulate into tender jelly at 62°C, but yolks remain runny until 68°C—which is how chefs make the perfect sous-vide poached egg!'
      };
    }
    if (c < 99.5) {
      return {
        icon: '☕',
        badge: 'HOT BEVERAGE ZONE',
        headline: 'Steaming Hot: Coffee Extraction & Simmering',
        chocolate: 'Boiling liquid fats; scorched cocoa aromas',
        phone: 'Hardware hazard: soldered circuits and battery delaminate',
        water: 'Near-boiling steamy fluid; gentle simmer bubbles at the base',
        food: 'Golden barista window for espresso & pour-over coffee (90°C–96°C)',
        tip: '💡 Coffee brewed above 96°C extracts harsh bitter tannins, while below 88°C it tastes sour and flat. 90°C–93°C is the golden extraction sweet spot!'
      };
    }
    if (c <= 105) {
      return {
        icon: '🫖',
        badge: '100°C BOILING TRANSITION',
        headline: 'The Steam Frontier: 1,600× Phase Explosion',
        chocolate: 'Severe burning; smoking caramelized cocoa solids',
        phone: 'Immediate hardware destruction & battery safety venting',
        water: 'Violent rolling boil: 1 liter of water creates 1,600 liters of steam!',
        food: 'Boiling pasta, starch gelatinization, and 99.9% germ sanitization',
        tip: '💡 Liquid water at sea level CANNOT exceed 100°C! Any extra heat energy added does not make the liquid hotter—it is absorbed as latent heat to vaporize water into steam!'
      };
    }
    if (c <= 250) {
      return {
        icon: '🍕',
        badge: 'BAKING & CARAMELIZATION',
        headline: 'Oven Heat: The Maillard Reaction & Crisp Crusts',
        chocolate: 'Pyrolyzed & charred; smoke point surpassed',
        phone: 'Tin-lead solder softens; plastics liquefy completely',
        water: 'Zero liquid water possible; high-velocity superheated dry steam',
        food: 'The Maillard reaction: sugars and amino acids crisp pizza crusts',
        tip: '💡 The mouth-watering aroma of toasted bread, seared pizza crusts, and roasted coffee is produced by the Maillard reaction, which accelerates between 140°C and 165°C!'
      };
    }
    return {
      icon: '🔥',
      badge: 'INCANDESCENT FLAME HAZARD',
      headline: 'Open Flame: Spontaneous Combustion & Magma',
      chocolate: 'Charred pure carbon residue and ash',
      phone: 'Vaporized circuits and melted aluminum chassis',
      water: 'Dissociated superheated gas and ionizing plasma',
      food: 'Paper spontaneously ignites at 233°C (451°F); wood pyrolyzes',
      tip: '💡 At 525°C (the Draper point), all solid objects on Earth begin glowing with visible red light, transitioning from invisible infrared into visible optical radiation!'
    };
  }

  /**
   * Practical Living Advice (Enriched & Backward Compatible)
   */
  static getPracticalLivingAdvice(celsius) {
    const matter = this.getEverydayMatterState(celsius);
    return {
      ...matter,
      clothing: `🍫 ${matter.chocolate} • 📱 ${matter.phone}`,
      impact: `💧 ${matter.water} • 🍳 ${matter.food}`
    };
  }

  /**
   * Backward compatibility aliases
   */
  static getThermalTwin(celsius) {
    return this.getPracticalLivingAdvice(celsius);
  }

  static getHeatIntensity(celsius) {
    return this.getPracticalLivingAdvice(celsius);
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
