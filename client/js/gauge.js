/**
 * Human-Friendly Analog Tachometer & Everyday Landmark Engine
 * Replaces abstract scientific metrics with relatable everyday zones:
 * - Freezing Zone (<0°C)
 * - Comfort Zone (15°C - 26°C)
 * - Warm / Summer Zone (27°C - 50°C)
 * - Scalding / Cooking Zone (>50°C)
 * Authors: Prakhar Harne & Naman Shrivastav
 */

class PhysicalGalvanometer {
  constructor() {
    this.needleGroup = document.getElementById('needleGroup');
    this.tierBadge = document.getElementById('gaugeTierBadge');
    this.roomDeltaText = document.getElementById('roomDeltaText');
    this.dialTicks = document.getElementById('dialTicks');

    // Everyday Landmarks List
    this.landmarks = [
      { id: 'lm-freeze-cryo', c: -195.79, name: 'Liquid Nitrogen', icon: '💨' },
      { id: 'lm-freeze-deep', c: -18, name: 'Ice Cream Freezer (-18°C)', icon: '🍦' },
      { id: 'lm-freeze-water', c: 0, name: 'Water Freezes / Snow (0°C)', icon: '🧊' },
      { id: 'lm-room', c: 22, name: 'Comfortable Room AC (22°C)', icon: '🛋️' },
      { id: 'lm-body', c: 37, name: 'Human Body Core (37°C)', icon: '🏃' },
      { id: 'lm-coffee', c: 85, name: 'Hot Starbucks Coffee (85°C)', icon: '☕' },
      { id: 'lm-boil', c: 100, name: 'Boiling Tea Kettle (100°C)', icon: '🫖' },
      { id: 'lm-oven', c: 200, name: 'Baking Pizza Oven (200°C)', icon: '🍕' }
    ];

    // Spring Physics Simulation State
    this.currentAngle = -60;
    this.targetAngle = -60;
    this.velocity = 0;
    this.stiffness = 0.085;
    this.damping = 0.75;

    this.renderDialMarkings();
    this.tickLoop();
  }

  renderDialMarkings() {
    if (!this.dialTicks) return;
    let ticksHtml = '';
    const cx = 150, cy = 150, r1 = 120, r2 = 105, r3 = 112;

    // Dial spans from -60 deg to +60 deg
    for (let angleDeg = -60; angleDeg <= 60; angleDeg += 6) {
      const isMajor = angleDeg % 30 === 0;
      const rad = (angleDeg - 90) * (Math.PI / 180);
      const innerR = isMajor ? r2 : r3;

      const x1 = cx + r1 * Math.cos(rad);
      const y1 = cy + r1 * Math.sin(rad);
      const x2 = cx + innerR * Math.cos(rad);
      const y2 = cy + innerR * Math.sin(rad);

      // Color-code zones on the dial
      let color = '#475569';
      if (angleDeg < -15) color = '#38bdf8'; // Freezing blue
      else if (angleDeg <= 10) color = '#10b981'; // Room comfort green
      else if (angleDeg <= 35) color = '#f59e0b'; // Warm orange
      else color = '#ef4444'; // Hot red

      const strokeW = isMajor ? '2.5' : '1.2';
      ticksHtml += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="${strokeW}"/>`;
    }
    this.dialTicks.innerHTML = ticksHtml;
  }

  update(celsius, formattedVal, unitSymbol, tier) {
    // 1. Calculate Target Angle for Needle (-60 to +60 degrees)
    // -50°C or below -> -60 deg
    // 0°C -> -25 deg
    // 22°C (Room) -> 0 deg (center top!)
    // 37°C (Body) -> +12 deg
    // 100°C (Boil) -> +38 deg
    // 250°C+ -> +60 deg
    let angle = 0;
    if (celsius <= 22) {
      // Map -50 to 22 onto -60 to 0
      const clamped = Math.max(-50, celsius);
      const ratio = (clamped - (-50)) / (22 - (-50)); // 0 to 1
      angle = -60 + ratio * 60;
    } else {
      // Map 22 to 220 onto 0 to +60
      const clamped = Math.min(220, celsius);
      const ratio = (clamped - 22) / (220 - 22); // 0 to 1
      angle = ratio * 60;
    }
    this.targetAngle = Math.max(-60, Math.min(60, angle));

    // 2. Update Zone Badge & Color
    if (this.tierBadge) {
      if (celsius < 0) {
        this.tierBadge.textContent = '❄️ FREEZING ZONE (< 0°C)';
        this.tierBadge.style.color = '#38bdf8';
        this.tierBadge.style.borderColor = '#38bdf8';
      } else if (celsius <= 26) {
        this.tierBadge.textContent = '🛋️ COMFORT LIVING ZONE (15–26°C)';
        this.tierBadge.style.color = '#10b981';
        this.tierBadge.style.borderColor = '#10b981';
      } else if (celsius <= 50) {
        this.tierBadge.textContent = '☀️ WARM / SUMMER HEAT (27–50°C)';
        this.tierBadge.style.color = '#f59e0b';
        this.tierBadge.style.borderColor = '#f59e0b';
      } else if (celsius < 100) {
        this.tierBadge.textContent = '☕ SCALDING HOT DRINK (50–99°C)';
        this.tierBadge.style.color = '#f97316';
        this.tierBadge.style.borderColor = '#f97316';
      } else {
        this.tierBadge.textContent = '🔥 WATER BOILING & BEYOND (≥100°C)';
        this.tierBadge.style.color = '#ef4444';
        this.tierBadge.style.borderColor = '#ef4444';
      }
    }

    // 3. Update Room Temperature Delta (e.g. "+78°C hotter than room temp")
    if (this.roomDeltaText) {
      const diff = celsius - 22.0;
      if (Math.abs(diff) < 0.5) {
        this.roomDeltaText.textContent = 'Exact room temperature equilibrium (22°C / 72°F)';
        this.roomDeltaText.style.color = '#10b981';
      } else if (diff > 0) {
        this.roomDeltaText.textContent = `▲ +${diff.toFixed(1)}°C hotter than normal room temp (22°C)`;
        this.roomDeltaText.style.color = '#f59e0b';
      } else {
        this.roomDeltaText.textContent = `▼ ${Math.abs(diff).toFixed(1)}°C colder than normal room temp (22°C)`;
        this.roomDeltaText.style.color = '#38bdf8';
      }
    }

    // 4. Highlight Closest Everyday Landmark
    this.highlightClosestLandmark(celsius);
  }

  highlightClosestLandmark(celsius) {
    let closest = this.landmarks[0];
    let minDiff = Math.abs(celsius - closest.c);

    for (const lm of this.landmarks) {
      const diff = Math.abs(celsius - lm.c);
      if (diff < minDiff) {
        minDiff = diff;
        closest = lm;
      }
    }

    document.querySelectorAll('.landmark-item').forEach(el => {
      if (el.getAttribute('data-id') === closest.id) {
        el.classList.add('active-landmark');
      } else {
        el.classList.remove('active-landmark');
      }
    });
  }

  // Damped Harmonic Spring Physics Loop
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
