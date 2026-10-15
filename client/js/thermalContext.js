/**
 * Real-World Thermal Context & Living Reality Engine
 * Translates abstract temperatures into everyday human experiences:
 * - What to wear
 * - Water & food physical phase
 * - Real-world object comparison (Coffee, Fridge, Pizza Oven, Ice Cream, etc.)
 * - Health & safety exposure limit
 * Authors: Prakhar Harne & Naman Shrivastav
 */

class RealWorldThermalContext {
  static getContext(celsius) {
    if (celsius <= -200) {
      return {
        title: 'Deep Space & Liquid Nitrogen',
        wear: 'Pressurized Space Suit',
        water: 'Rock-Hard Cryo Crystal',
        twin: 'Liquid Nitrogen (-196°C) / Deep Space',
        safety: 'Instant flash-freezing in seconds',
        icon: '🚀',
        color: '#38bdf8'
      };
    }
    if (celsius <= -50) {
      return {
        title: 'Polar Deep Freeze',
        wear: 'Thermal Arctic Parka & Face Mask',
        water: 'Rock-Solid Frozen Ice',
        twin: 'Dry Ice (-78.5°C) / Antarctic Winter (-89°C)',
        safety: 'Exposed skin freezes in under 2 minutes',
        icon: '🧊',
        color: '#0ea5e9'
      };
    }
    if (celsius <= -15) {
      return {
        title: 'Severe Sub-Zero Winter',
        wear: 'Heavy Puffer Jacket, Gloves & Beanie',
        water: 'Hard Ice & Packed Snow',
        twin: 'Deep Kitchen Freezer (-18°C)',
        safety: 'Frostbite risk after 15 mins of exposure',
        icon: '❄️',
        color: '#06b6d4'
      };
    }
    if (celsius <= 0) {
      return {
        title: 'Freezing Threshold / Snow Weather',
        wear: 'Winter Coat, Scarf & Boots',
        water: 'Water Freezing Point (Turns into Ice)',
        twin: 'Ice Skating Rink / Fresh Snow Falling',
        safety: 'Hypothermia risk with prolonged exposure',
        icon: '⛄',
        color: '#2dd4bf'
      };
    }
    if (celsius <= 15) {
      return {
        title: 'Chilly Autumn / Early Spring',
        wear: 'Hoodie, Sweater or Light Jacket',
        water: 'Cold Refreshing Liquid',
        twin: 'Chilled Milk in Refrigerator (~4°C)',
        safety: 'Comfortable & safe with a warm layer',
        icon: '🍂',
        color: '#14b8a6'
      };
    }
    if (celsius <= 26) {
      return {
        title: 'Ideal Room Temperature',
        wear: 'Casual T-Shirt & Shorts / Jeans',
        water: 'Room-Temperature Drinking Water',
        twin: 'Comfortable Air-Conditioned Bedroom (22°C)',
        safety: 'Perfect human biological comfort zone',
        icon: '🛋️',
        color: '#10b981'
      };
    }
    if (celsius <= 36) {
      return {
        title: 'Warm & Sunny Summer',
        wear: 'Light T-Shirt, Sunglasses & Cap',
        water: 'Warm Relaxing Bath Water',
        twin: 'Sunny Beach Day in Summer',
        safety: 'Drink plenty of water to avoid heat fatigue',
        icon: '🏖️',
        color: '#f59e0b'
      };
    }
    if (celsius <= 40) {
      return {
        title: 'Human Body Core Temp / Fever',
        wear: 'Breathable clothes, rest in shade',
        water: 'Hot Spa / Jacuzzi (~38°C)',
        twin: 'Healthy Human Body (37°C) or Mild Fever',
        safety: 'Heat exhaustion danger with heavy activity',
        icon: '🏃',
        color: '#f97316'
      };
    }
    if (celsius <= 65) {
      return {
        title: 'Extreme Heatwave / Desert Sun',
        wear: 'UV-blocking linen, stay indoors in AC',
        water: 'Very Hot Household Tap Water',
        twin: 'Death Valley Record High (56.7°C)',
        safety: 'Dangerous heatstroke within 30 minutes',
        icon: '🏜️',
        color: '#ea580c'
      };
    }
    if (celsius <= 99) {
      return {
        title: 'Scalding Hot / Fresh Coffee & Tea',
        wear: 'Caution: Thermal insulation gloves',
        water: 'Steaming Near-Boiling Liquid',
        twin: 'Freshly Brewed Hot Coffee (~85°C)',
        safety: 'Causes second-degree burns in under 3 seconds',
        icon: '☕',
        color: '#ef4444'
      };
    }
    if (celsius <= 250) {
      return {
        title: 'Water Boiling / Kitchen Baking',
        wear: 'Heavy Silicone Oven Mitts',
        water: 'Vigorously Boiling Water & Scalding Steam',
        twin: 'Baking Cake / Pizza Oven (~200°C)',
        safety: 'Instant third-degree steam burns on contact',
        icon: '🍕',
        color: '#dc2626'
      };
    }
    return {
      title: 'Incandescent Forge & Stellar Heat',
      wear: 'Full Proximity Firefighter Heat Shield',
      water: 'Completely Vaporized Gas',
      twin: 'Molten Lava (~1000°C) / Solar Surface',
      safety: 'Instant cremation / matter vaporizes',
      icon: '🌋',
      color: '#b91c1c'
    };
  }
}

window.RealWorldThermalContext = RealWorldThermalContext;
