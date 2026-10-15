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
  static getPracticalLivingAdvice(celsius) {
    const c = typeof celsius === 'number' ? (isNaN(celsius) ? 0 : celsius) : (parseFloat(celsius) || 0);

    if (c <= -40) {
      return {
        icon: '🥶',
        headline: 'Extreme Sub-Zero Freeze',
        badge: 'DANGEROUS FROSTBITE',
        clothing: '🧥 Heavy Arctic parka, snow boots, thermal balaclava & mittens',
        impact: `At ${c.toFixed(1)}°C (${((c * 1.8) + 32).toFixed(1)}°F), bare skin suffers frostbite within 5 minutes. Car batteries fail and tires stiffen.`,
        tip: '💡 Never touch bare metal outdoors; always carry insulated emergency blankets.'
      };
    }
    if (c <= -10) {
      return {
        icon: '❄️',
        headline: 'Deep Sub-Zero Winter',
        badge: 'FREEZING COLD',
        clothing: '🧤 Thick winter coat, fleece layers, thermal socks, beanie & gloves',
        impact: `At ${c.toFixed(1)}°C (${((c * 1.8) + 32).toFixed(1)}°F), breath fogs heavily; ice and snow stay rock-hard without melting.`,
        tip: '💡 Standard home food freezers operate at -18°C (0°F) to preserve groceries for months.'
      };
    }
    if (c < 0) {
      return {
        icon: '🧊',
        headline: 'Freezing Winter Weather',
        badge: 'ICE HAZARD',
        clothing: '🧥 Winter jacket, warm sweater, scarf & insulated footwear',
        impact: `At ${c.toFixed(1)}°C (${((c * 1.8) + 32).toFixed(1)}°F), rain turns to sleet and puddles freeze into slippery black ice on roads.`,
        tip: '💡 Spread rock salt on walkways to melt ice, and protect outdoor garden plants from frost.'
      };
    }
    if (Math.abs(c) < 0.05) {
      return {
        icon: '🧊',
        headline: 'Water Freezing Point',
        badge: '0°C FREEZE POINT',
        clothing: '🧤 Warm winter coat, trousers, and insulated gloves',
        impact: 'The exact freezing threshold where liquid water crystallizes into solid ice (32°F / 273.15 K).',
        tip: '💡 Water pipes can freeze and burst; leave faucets dripping slightly during freeze warnings.'
      };
    }
    if (c <= 14) {
      return {
        icon: '🍂',
        headline: 'Chilly Autumn / Spring Day',
        badge: 'BRISK & COOL',
        clothing: '🧥 Light jacket, hoodie, warm knit sweater, or windbreaker',
        impact: `At ${c.toFixed(1)}°C (${((c * 1.8) + 32).toFixed(1)}°F), crisp outdoor air feels refreshing for walking or jogging, but chilly if sitting.`,
        tip: '💡 Natural food pantries and cellars maintain ~10°C–12°C to naturally preserve produce and wine.'
      };
    }
    if (c <= 25) {
      return {
        icon: '🛋️',
        headline: 'Comfortable Living Room',
        badge: 'OPTIMAL COMFORT',
        clothing: '👕 T-shirt, jeans, light comfortable indoor clothing',
        impact: `At ${c.toFixed(1)}°C (${((c * 1.8) + 32).toFixed(1)}°F), this is the golden comfort zone for human focus, studying, and restful sleep.`,
        tip: '💡 Keep home thermostats set around 21°C–23°C (70°F–73°F) for maximum comfort and energy efficiency.'
      };
    }
    if (c <= 32) {
      return {
        icon: '☀️',
        headline: 'Warm Summer Weather',
        badge: 'WARM & PLEASANT',
        clothing: '🩳 Shorts, short-sleeve shirt, sandals or light sneakers',
        impact: `At ${c.toFixed(1)}°C (${((c * 1.8) + 32).toFixed(1)}°F), pleasant warm weather for swimming, beaches, and outdoor summer fun.`,
        tip: '💡 Drink extra water during outdoor activities and apply sunscreen (SPF 30+) if in direct sun.'
      };
    }
    if (c <= 38) {
      return {
        icon: '🏃',
        headline: 'Body Temperature / Sweltering Heat',
        badge: 'SWELTERING HEAT',
        clothing: '🕶️ Loose breathable cotton clothing, sun hat & sunglasses',
        impact: `At ${c.toFixed(1)}°C (${((c * 1.8) + 32).toFixed(1)}°F), normal human body core is 37°C. Ambient air feels heavy and causes sweating.`,
        tip: '💡 Seek shade during afternoon hours (12 PM–4 PM) and keep hydrated with electrolytes.'
      };
    }
    if (c <= 50) {
      return {
        icon: '🥵',
        headline: 'Dangerous Extreme Heatwave',
        badge: 'HEATSTROKE WARNING',
        clothing: '⛱️ Stay indoors in air conditioning; loose UV protective gear outdoors',
        impact: `At ${c.toFixed(1)}°C (${((c * 1.8) + 32).toFixed(1)}°F), asphalt burns bare skin, and high humidity risks heat exhaustion.`,
        tip: '💡 Never leave children or pets inside parked vehicles—car interiors heat up to lethal levels within minutes.'
      };
    }
    if (c <= 70) {
      return {
        icon: '🚿',
        headline: 'Hot Tap Water / Steamy Dishwater',
        badge: 'HOT LIQUID',
        clothing: '⚠️ Caution: Handle with care; too hot for prolonged skin contact',
        impact: `At ${c.toFixed(1)}°C (${((c * 1.8) + 32).toFixed(1)}°F), hot domestic water can cause painful scalds in under 3 seconds.`,
        tip: '💡 Set residential water heaters to 49°C–50°C (120°F) to prevent accidental household burns.'
      };
    }
    if (c <= 90) {
      return {
        icon: '☕',
        headline: 'Freshly Brewed Hot Coffee & Tea',
        badge: 'HOT BEVERAGE',
        clothing: '☕ Insulated mug; hold by cup handle or heat sleeve only',
        impact: `At ${c.toFixed(1)}°C (${((c * 1.8) + 32).toFixed(1)}°F), standard serving temperature for piping-hot coffee, tea, and soups.`,
        tip: '💡 Allow coffee to cool for 2–3 minutes (down to ~65°C) to taste delicate aromas without burning your tongue.'
      };
    }
    if (c < 99.5) {
      return {
        icon: '🫖',
        headline: 'Near-Boiling / Simmering Broth',
        badge: 'SIMMERING WATER',
        clothing: '🧤 Kitchen mitts recommended; watch for rising hot steam',
        impact: `At ${c.toFixed(1)}°C (${((c * 1.8) + 32).toFixed(1)}°F), gentle bubbles form at the base—ideal for delicate poaching, soups, and green teas.`,
        tip: '💡 Simmering (85°C–95°C) cooks tender proteins evenly without tearing delicate meats.'
      };
    }
    if (c <= 105) {
      return {
        icon: '🫖',
        headline: 'Boiling Water for Cooking',
        badge: '100°C BOILING POINT',
        clothing: '🧤 Silicone kitchen mitts; keep face clear of steam vents',
        impact: `At ${c.toFixed(1)}°C (${((c * 1.8) + 32).toFixed(1)}°F), active rolling boil with energetic steam. Water at sea level cannot get hotter than this.`,
        tip: '💡 Ideal for boiling pasta, blanching veggies, sanitizing kitchenware, and sterilizing water.'
      };
    }
    if (c <= 250) {
      return {
        icon: '🍕',
        headline: 'Hot Baking & Roasting Oven',
        badge: 'BAKING TEMPERATURE',
        clothing: '🧤 Heavy-duty heat-resistant oven mitts required',
        impact: `At ${c.toFixed(1)}°C (${((c * 1.8) + 32).toFixed(1)}°F), typical oven temperature for baking pizza, crispy bread, and roasting chicken.`,
        tip: '💡 This heat triggers the Maillard reaction, producing golden-brown crusts and delicious savory aromas.'
      };
    }
    return {
      icon: '🔥',
      headline: 'Extreme Stovetop Flame & Fire',
      badge: 'OPEN FLAME HAZARD',
      clothing: '🧯 Fire safety equipment & high-temperature shields',
      impact: `At ${c.toFixed(0)}°C (${((c * 1.8) + 32).toFixed(0)}°F), temperatures far exceed cooking. Paper ignites at 233°C; aluminium melts at 660°C.`,
      tip: '💡 Kitchen gas burner flames reach 1,000°C+; keep an ABC-rated kitchen fire extinguisher readily accessible.'
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
