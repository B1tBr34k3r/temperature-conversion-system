/**
 * Physical Analog Galvanometer (Damped Harmonic Spring Physics)
 * Rebuilt for Full-Screen Laboratory Dashboard
 * Authors: Prakhar Harne & Naman Shrivastav
 */

class PhysicalGalvanometer {
  constructor() {
    this.needleGroup = document.getElementById('needleGroup');
    this.tierBadge = document.getElementById('gaugeTierBadge');
    this.dialTicks = document.getElementById('dialTicks');
    this.dialActiveArc = document.getElementById('dialActiveArc');

    // Spring Physics Simulation State
    this.currentAngle = -65; // Range: -65 deg to +65 deg
    this.targetAngle = -65;
    this.velocity = 0;
    this.stiffness = 0.085; // Spring constant
    this.damping = 0.74;    // Mechanical damping ratio

    // Build dial markings & tick loop
    this.renderTicks();
    this.tickLoop();
  }

  renderTicks() {
    if (!this.dialTicks) return;
    let ticksHtml = '';
    const cx = 150, cy = 150, r1 = 120, r2 = 106, r3 = 112;

    for (let angleDeg = -65; angleDeg <= 65; angleDeg += 5) {
      const isMajor = angleDeg % 25 === 0 || angleDeg === 0;
      const rad = (angleDeg - 90) * (Math.PI / 180);
      const innerR = isMajor ? r2 : r3;

      const x1 = cx + r1 * Math.cos(rad);
      const y1 = cy + r1 * Math.sin(rad);
      const x2 = cx + innerR * Math.cos(rad);
      const y2 = cy + innerR * Math.sin(rad);

      const color = angleDeg > 35 ? '#ff4d4d' : (isMajor ? '#e2e8f0' : '#475569');
      const strokeW = isMajor ? '2' : '1';

      ticksHtml += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="${strokeW}"/>`;
    }
    this.dialTicks.innerHTML = ticksHtml;
  }

  update(celsius, formattedVal, unitSymbol, tier) {
    // Map -273.15°C -> -65 deg
    // 0°C -> -15 deg
    // 100°C -> +30 deg
    // 350°C -> +65 deg
    let angle = -65;
    if (celsius <= 0) {
      const normalized = (celsius + 273.15) / 273.15; // 0 to 1
      angle = -65 + normalized * 50; // -65 to -15
    } else {
      const normalized = Math.min(1, celsius / 350);
      angle = -15 + normalized * 80; // -15 to +65
    }
    this.targetAngle = Math.max(-65, Math.min(65, angle));

    // Update Tier Badge
    if (this.tierBadge) {
      this.tierBadge.textContent = tier.label;
      this.tierBadge.style.color = tier.color;
      this.tierBadge.style.borderColor = tier.color;
    }
  }

  // Damped Harmonic Oscillation Loop
  tickLoop() {
    const loop = () => {
      const displacement = this.targetAngle - this.currentAngle;
      const springForce = displacement * this.stiffness;

      this.velocity += springForce;
      this.velocity *= this.damping;
      this.currentAngle += this.velocity;

      if (this.needleGroup) {
        this.needleGroup.setAttribute('transform', `translate(150, 150) rotate(${this.currentAngle.toFixed(2)})`);
      }

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

window.PhysicalGalvanometer = PhysicalGalvanometer;
