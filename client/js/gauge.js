/**
 * Physical Analog Galvanometer & Liquid Thermal Column
 * Incorporates Damped Harmonic Oscillation (Spring Physics)
 * Milestone 3: Human-Crafted Tactile Instrumentation
 */

class PhysicalGalvanometer {
  constructor() {
    this.needleGroup = document.getElementById('needleGroup');
    this.tierBadge = document.getElementById('gaugeTierBadge');
    this.dialActiveArc = document.getElementById('dialActiveArc');
    this.dialTicks = document.getElementById('dialTicks');
    this.liquidColumn = document.getElementById('liquidColumn');
    this.reservoirCore = document.getElementById('reservoirCore');
    this.tubeStateLabel = document.getElementById('tubeStateLabel');
    this.bubblesContainer = document.getElementById('bubblesContainer');

    // Spring Physics Simulation State
    this.currentAngle = -60; // Degrees (-60 to +60 range)
    this.targetAngle = -60;
    this.velocity = 0;
    this.stiffness = 0.08; // Spring constant
    this.damping = 0.76;   // Friction / air damping
    this.animating = false;

    // Build Dial Ticks on SVG
    this.renderTicks();

    // Start Spring Physics Loop
    this.tickLoop();
  }

  renderTicks() {
    if (!this.dialTicks) return;
    let ticksHtml = '';
    const cx = 130, cy = 140, r1 = 105, r2 = 93, r3 = 97;

    for (let angleDeg = -60; angleDeg <= 60; angleDeg += 6) {
      const isMajor = angleDeg % 30 === 0;
      const rad = (angleDeg - 90) * (Math.PI / 180);
      const innerR = isMajor ? r2 : r3;

      const x1 = cx + r1 * Math.cos(rad);
      const y1 = cy + r1 * Math.sin(rad);
      const x2 = cx + innerR * Math.cos(rad);
      const y2 = cy + innerR * Math.sin(rad);

      const color = isMajor ? (angleDeg > 30 ? '#ff4d4d' : '#94a3b8') : '#334155';
      const strokeW = isMajor ? '2' : '1';

      ticksHtml += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="${strokeW}"/>`;
    }
    this.dialTicks.innerHTML = ticksHtml;
  }

  update(celsius, formattedVal, unitSymbol, tier) {
    // 1. Calculate Target Angle for Galvanometer (-60 to +60 degrees)
    // Map -273.15°C (Absolute Zero) -> -60 deg
    // 0°C -> 0 deg
    // 100°C -> +35 deg
    // 350°C -> +60 deg
    let normalized = 0;
    if (celsius <= 0) {
      // -273.15 to 0
      normalized = (celsius + 273.15) / 273.15; // 0 to 1
      this.targetAngle = -60 + normalized * 60; // -60 to 0
    } else {
      // 0 to 350
      normalized = Math.min(1, celsius / 350);
      this.targetAngle = normalized * 60; // 0 to +60
    }

    // 2. Update Tier Badge
    if (this.tierBadge) {
      this.tierBadge.textContent = tier.label;
      this.tierBadge.style.color = tier.color;
    }

    // 3. Update Liquid Column Height & Color
    if (this.liquidColumn) {
      // Map height from 5% (-273.15°C) to 95% (350°C)
      const clampedC = Math.max(-273.15, Math.min(350, celsius));
      const heightPercent = 5 + ((clampedC + 273.15) / (350 + 273.15)) * 90;
      this.liquidColumn.style.height = `${heightPercent.toFixed(1)}%`;

      // Update fluid color gradient and reservoir bulb
      let fluidGradient = '';
      let reservoirColor = '';

      if (celsius <= -100) {
        // Cryogenic liquid nitrogen / absolute zero (electric cyan/blue)
        fluidGradient = 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)';
        reservoirColor = 'radial-gradient(circle at 35% 35%, #7dd3fc, #0284c7 70%, #0369a1 100%)';
        this.tubeStateLabel.textContent = 'CRYOGENIC LIQUID';
      } else if (celsius <= 0) {
        // Sub-zero freezing (frost mint)
        fluidGradient = 'linear-gradient(180deg, #2dd4bf 0%, #0d9488 100%)';
        reservoirColor = 'radial-gradient(circle at 35% 35%, #5eead4, #0d9488 70%, #115e59 100%)';
        this.tubeStateLabel.textContent = 'SUB-ZERO FLUID';
      } else if (celsius <= 99) {
        // Ambient / warm mercury
        fluidGradient = 'linear-gradient(180deg, #ff9f1c 0%, #ea580c 100%)';
        reservoirColor = 'radial-gradient(circle at 35% 35%, #ffb703, #ea580c 70%, #9a3412 100%)';
        this.tubeStateLabel.textContent = 'MERCURY COLUMN';
      } else {
        // Boiling / superheated (cadmium red + bubbles)
        fluidGradient = 'linear-gradient(180deg, #ff4d4d 0%, #b91c1c 100%)';
        reservoirColor = 'radial-gradient(circle at 35% 35%, #fca5a5, #b91c1c 70%, #7f1d1d 100%)';
        this.tubeStateLabel.textContent = 'BOILING PLASMA TUBE';
      }

      this.liquidColumn.style.background = fluidGradient;
      if (this.reservoirCore) {
        this.reservoirCore.style.background = reservoirColor;
      }

      // Handle Boiling Bubbles
      this.renderBubbles(celsius >= 100);
    }
  }

  renderBubbles(isBoiling) {
    if (!this.bubblesContainer) return;
    if (!isBoiling) {
      this.bubblesContainer.innerHTML = '';
      return;
    }

    if (this.bubblesContainer.children.length === 0) {
      let bubblesHtml = '';
      for (let i = 0; i < 6; i++) {
        const left = Math.random() * 16 + 2;
        const size = Math.random() * 4 + 2;
        const delay = Math.random() * 1.2;
        bubblesHtml += `<div class="bubble" style="left: ${left}px; bottom: 4px; width: ${size}px; height: ${size}px; animation-delay: ${delay}s;"></div>`;
      }
      this.bubblesContainer.innerHTML = bubblesHtml;
    }
  }

  // Damped Harmonic Oscillation (Physical Spring Needle)
  tickLoop() {
    const loop = () => {
      const displacement = this.targetAngle - this.currentAngle;
      const springForce = displacement * this.stiffness;

      this.velocity += springForce;
      this.velocity *= this.damping;
      this.currentAngle += this.velocity;

      if (this.needleGroup) {
        this.needleGroup.setAttribute('transform', `translate(130, 140) rotate(${this.currentAngle.toFixed(2)})`);
      }

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

window.PhysicalGalvanometer = PhysicalGalvanometer;
