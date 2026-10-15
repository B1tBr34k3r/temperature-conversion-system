/**
 * Holographic Radial Gauge & Telemetry Visualizer
 * Milestone 3: Mind-Blowing UI Component
 */

class HolographicGauge {
  constructor(svgId) {
    this.svg = document.getElementById(svgId);
    this.arc = document.getElementById('gaugeProgressArc');
    this.valText = document.getElementById('gaugeCenterValue');
    this.unitText = document.getElementById('gaugeCenterUnit');
    this.tierBadge = document.getElementById('gaugeTierBadge');

    // Arc length circumference for r=70: 2 * PI * 70 = 439.82
    this.circumference = 439.82;
    if (this.arc) {
      this.arc.style.strokeDasharray = `${this.circumference}`;
      this.arc.style.strokeDashoffset = `${this.circumference}`;
    }
  }

  update(celsius, formattedVal, unitSymbol, tier) {
    if (!this.arc) return;

    // Map Celsius from Absolute Zero (-273.15) to Boiling+ (300°C) into 0% to 100%
    const minC = -273.15;
    const maxC = 350;
    const clamped = Math.max(minC, Math.min(maxC, celsius));
    const percent = Math.max(0, Math.min(1, (clamped - minC) / (maxC - minC)));

    // 270 degree sweep
    const offset = this.circumference * (1 - percent * 0.75);
    this.arc.style.strokeDashoffset = offset;

    // Color gradient based on tier
    if (celsius <= -270) {
      this.arc.style.stroke = '#00f0ff';
    } else if (celsius <= 0) {
      this.arc.style.stroke = '#38bdf8';
    } else if (celsius <= 37) {
      this.arc.style.stroke = '#10b981';
    } else if (celsius <= 100) {
      this.arc.style.stroke = '#f59e0b';
    } else {
      this.arc.style.stroke = '#ff0055';
    }

    if (this.valText) this.valText.textContent = formattedVal;
    if (this.unitText) this.unitText.textContent = unitSymbol;
    if (this.tierBadge) {
      this.tierBadge.textContent = tier.label;
      this.tierBadge.style.color = tier.color;
      this.tierBadge.style.borderColor = tier.color;
    }
  }
}

window.HolographicGauge = HolographicGauge;
