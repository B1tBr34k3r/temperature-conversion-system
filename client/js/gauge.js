/**
 * Human-Friendly Analog Tachometer & Everyday Landmark Engine
 * Replaces abstract scientific metrics with relatable everyday zones:
 * - Freezing Zone (<0°C)
 * - Comfort Zone (15°C - 26°C)
 * - Warm / Summer Zone (27°C - 50°C)
 * - Scalding / Cooking Zone (50°C - 220°C)
 * - Absurd / Extreme Overdrive Mode (>220°C & Cryogenic <-50°C)
 * Authors: Prakhar Harne & Naman Shrivastav
 */

class PhysicalGalvanometer {
  constructor() {
    this.needleGroup = document.getElementById('needleGroup');
    this.tierBadge = document.getElementById('gaugeTierBadge');
    this.roomDeltaText = document.getElementById('roomDeltaText');
    this.dialTicks = document.getElementById('dialTicks');
    this.overdriveGroup = document.getElementById('overdriveIndicatorGroup');
    this.overdriveText = document.getElementById('overdriveText');

    // 8th Dynamic Extreme Benchmark Slot Elements
    this.extremeBtn = document.getElementById('extremeBenchmarkBtn');
    this.extremeIcon = document.getElementById('extremeLmIcon');
    this.extremeName = document.getElementById('extremeLmName');
    this.extremeDeg = document.getElementById('extremeLmDeg');

    // Everyday Standard Living Landmarks List
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
    this.currentCelsius = 22;

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
      else color = '#ef4444'; // Hot red / Overdrive

      const strokeW = isMajor ? '2.5' : '1.2';
      ticksHtml += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="${strokeW}"/>`;
    }
    this.dialTicks.innerHTML = ticksHtml;
  }

  /**
   * Dynamically maps any extreme/absurd temperature to its real-world equivalent landmark
   */
  getExtremeBenchmark(celsius) {
    if (celsius >= 10000000) {
      return { icon: '🌌', name: 'Stellar Fusion Core', deg: '15,000,000°C / 27,000,000°F', c: 15000000 };
    }
    if (celsius >= 20000) {
      return { icon: '⚡', name: 'Atmospheric Lightning Bolt', deg: '30,000°C / 54,032°F', c: 30000 };
    }
    if (celsius >= 4000) {
      return { icon: '☀️', name: 'Solar Photosphere Surface', deg: '5,505°C / 9,941°F', c: 5505 };
    }
    if (celsius >= 2200) {
      return { icon: '💡', name: 'Tungsten Light Filament', deg: '3,422°C / 6,192°F', c: 3422 };
    }
    if (celsius >= 1400) {
      return { icon: '🏭', name: 'Molten Steel Smelter', deg: '1,538°C / 2,800°F', c: 1538 };
    }
    if (celsius >= 700) {
      return { icon: '🌋', name: 'Kitchen Flame / Basalt Lava', deg: '1,000°C / 1,832°F', c: 1000 };
    }
    if (celsius >= 350) {
      return { icon: '🪐', name: 'Planet Venus Atmosphere', deg: '464°C / 867°F', c: 464 };
    }
    if (celsius >= 220) {
      return { icon: '🧪', name: 'Molten Lead Hearth', deg: '327°C / 621°F', c: 327 };
    }

    // Deep Sub-zero / Cryogenic Absurd Temperatures
    if (celsius <= -250) {
      return { icon: '⚛️', name: 'Absolute Zero Limit (0 K)', deg: '-273.15°C / -459.67°F', c: -273.15 };
    }
    if (celsius <= -150) {
      return { icon: '💨', name: 'Liquid Nitrogen Cryo Bath', deg: '-195.8°C / -320.4°F', c: -195.8 };
    }
    if (celsius < -50) {
      return { icon: '🧊', name: 'Antarctica Record Cold', deg: '-89.2°C / -128.6°F', c: -89.2 };
    }

    // Default Extreme preset when in normal range
    return { icon: '🌋', name: 'Kitchen Flame / Basalt Lava', deg: '1,000°C / 1,832°F', c: 1000 };
  }

  update(celsius, formattedVal, unitSymbol, tier) {
    this.currentCelsius = celsius;

    // 1. Calculate Target Angle for Needle (-60 to +60 degrees)
    // -50°C or below -> -60 deg
    // 0°C -> -25 deg
    // 22°C (Room) -> 0 deg (center top)
    // 37°C (Body) -> +12 deg
    // 100°C (Boil) -> +38 deg
    // 220°C+ -> +60 deg (Pegged redline with dynamic flutter)
    let angle = 0;
    if (celsius <= 22) {
      const clamped = Math.max(-50, celsius);
      const ratio = (clamped - (-50)) / (22 - (-50)); // 0 to 1
      angle = -60 + ratio * 60;
    } else {
      const clamped = Math.min(220, celsius);
      const ratio = (clamped - 22) / (220 - 22); // 0 to 1
      angle = ratio * 60;
    }
    this.targetAngle = Math.max(-60, Math.min(60, angle));

    // 2. Overdrive Indicator in SVG Dial
    if (this.overdriveGroup && this.overdriveText) {
      if (celsius > 220) {
        this.overdriveGroup.style.opacity = '1';
        if (celsius >= 10000000) {
          this.overdriveText.textContent = `🌌 COSMIC: ${Math.round(celsius).toLocaleString()}°C`;
          this.overdriveText.setAttribute('fill', '#c084fc');
        } else if (celsius >= 4000) {
          this.overdriveText.textContent = `☀️ SOLAR: ${Math.round(celsius).toLocaleString()}°C`;
          this.overdriveText.setAttribute('fill', '#fde047');
        } else {
          this.overdriveText.textContent = `🚨 OVERDRIVE: ${Math.round(celsius).toLocaleString()}°C`;
          this.overdriveText.setAttribute('fill', '#ff4d4d');
        }
      } else if (celsius < -50) {
        this.overdriveGroup.style.opacity = '1';
        if (celsius <= -270) {
          this.overdriveText.textContent = `⚛️ ZERO LIMIT: ${celsius.toFixed(1)}°C`;
          this.overdriveText.setAttribute('fill', '#a5f3fc');
        } else {
          this.overdriveText.textContent = `❄️ CRYO REDLINE: ${celsius.toFixed(1)}°C`;
          this.overdriveText.setAttribute('fill', '#38bdf8');
        }
      } else {
        this.overdriveGroup.style.opacity = '0';
      }
    }

    // 3. Update Zone Badge & Color
    if (this.tierBadge) {
      if (celsius >= 1000000) {
        this.tierBadge.textContent = '🌌 STELLAR / COSMIC FUSION (>10⁶°C)';
        this.tierBadge.style.color = '#c084fc';
        this.tierBadge.style.borderColor = '#c084fc';
      } else if (celsius >= 1000) {
        this.tierBadge.textContent = '🌋 INCANDESCENT OVERDRIVE (≥1,000°C)';
        this.tierBadge.style.color = '#ff3838';
        this.tierBadge.style.borderColor = '#ff3838';
      } else if (celsius > 220) {
        this.tierBadge.textContent = '🔥 INDUSTRIAL OVERDRIVE (>220°C)';
        this.tierBadge.style.color = '#ef4444';
        this.tierBadge.style.borderColor = '#ef4444';
      } else if (celsius <= -270) {
        this.tierBadge.textContent = '⚛️ ABSOLUTE ZERO REACHED (0 K)';
        this.tierBadge.style.color = '#a5f3fc';
        this.tierBadge.style.borderColor = '#a5f3fc';
      } else if (celsius <= -50) {
        this.tierBadge.textContent = '❄️ DEEP CRYOGENIC REALM (≤-50°C)';
        this.tierBadge.style.color = '#38bdf8';
        this.tierBadge.style.borderColor = '#38bdf8';
      } else if (celsius < 0) {
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
        this.tierBadge.textContent = '🔥 WATER BOILING & OVEN (100–220°C)';
        this.tierBadge.style.color = '#ef4444';
        this.tierBadge.style.borderColor = '#ef4444';
      }
    }

    // 4. Update Room Temperature Delta with Overdrive Multiplier
    if (this.roomDeltaText) {
      const diff = celsius - 22.0;
      if (Math.abs(diff) < 0.5) {
        this.roomDeltaText.textContent = 'Exact room temperature equilibrium (22°C / 72°F)';
        this.roomDeltaText.style.color = '#10b981';
      } else if (diff > 0) {
        if (celsius > 220) {
          const boilingMultiple = (celsius / 100).toFixed(1);
          this.roomDeltaText.textContent = `▲ +${diff.toLocaleString(undefined, {maximumFractionDigits: 1})}°C hotter than room temp (${boilingMultiple}× water boiling energy)`;
          this.roomDeltaText.style.color = '#ff3838';
        } else {
          this.roomDeltaText.textContent = `▲ +${diff.toFixed(1)}°C hotter than normal room temp (22°C)`;
          this.roomDeltaText.style.color = '#f59e0b';
        }
      } else {
        if (celsius < -50) {
          this.roomDeltaText.textContent = `▼ ${Math.abs(diff).toFixed(1)}°C colder than normal room temp (DEEP CRYO SUB-ZERO)`;
          this.roomDeltaText.style.color = '#38bdf8';
        } else {
          this.roomDeltaText.textContent = `▼ ${Math.abs(diff).toFixed(1)}°C colder than normal room temp (22°C)`;
          this.roomDeltaText.style.color = '#38bdf8';
        }
      }
    }

    // 5. Dynamic Update of 8th Extreme Benchmark Slot
    const extremeBench = this.getExtremeBenchmark(celsius);
    if (this.extremeBtn && this.extremeIcon && this.extremeName && this.extremeDeg) {
      this.extremeIcon.textContent = extremeBench.icon;
      this.extremeName.textContent = extremeBench.name;
      this.extremeDeg.textContent = extremeBench.deg;
      this.extremeBtn.setAttribute('data-c', extremeBench.c);
    }

    // 6. Highlight Closest Everyday Landmark or Extreme Benchmark
    this.highlightClosestLandmark(celsius);
  }

  highlightClosestLandmark(celsius) {
    if (celsius > 220 || celsius < -50) {
      // Absurd temperature: highlight the 8th Extreme Benchmark button!
      document.querySelectorAll('.landmark-item').forEach(el => {
        el.classList.remove('active-landmark');
      });
      if (this.extremeBtn) {
        this.extremeBtn.classList.add('active-landmark');
      }
      return;
    }

    // Normal living range: highlight closest standard landmark
    if (this.extremeBtn) {
      this.extremeBtn.classList.remove('active-landmark');
    }

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

  // Damped Harmonic Spring Physics Loop with Overdrive Flutter
  tickLoop() {
    const loop = () => {
      const displacement = this.targetAngle - this.currentAngle;
      const springForce = displacement * this.stiffness;

      this.velocity += springForce;
      this.velocity *= this.damping;
      this.currentAngle += this.velocity;

      // Dynamic redline needle flutter jitter when in extreme overdrive
      let flutter = 0;
      if (this.currentCelsius > 220) {
        const intensity = Math.min(3.2, 0.75 + (this.currentCelsius - 220) / 400);
        flutter = (Math.sin(Date.now() / 24) * 1.6 + Math.cos(Date.now() / 15) * 0.9) * (intensity / 2.5);
      } else if (this.currentCelsius < -50) {
        const intensity = Math.min(3.2, 0.75 + (-50 - this.currentCelsius) / 200);
        flutter = (Math.sin(Date.now() / 28) * 1.4) * (intensity / 2.0);
      }

      const displayAngle = this.currentAngle + flutter;

      if (this.needleGroup) {
        this.needleGroup.setAttribute('transform', `translate(150, 150) rotate(${displayAngle.toFixed(2)})`);
      }

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

window.PhysicalGalvanometer = PhysicalGalvanometer;
