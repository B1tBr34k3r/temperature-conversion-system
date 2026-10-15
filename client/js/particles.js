/**
 * Artisanal Thermal Convection & Brownian Kinetics Engine (HTML5 Canvas 2D)
 * Features:
 * - Hexagonal crystal locking at cryogenic temperatures
 * - Natural Brownian diffusion at ambient temperatures
 * - Vertical thermal convection plumes & heat sparks at boiling/superheated states
 * Authors: Prakhar Harne & Naman Shrivastav
 */

class ThermalParticleReactor {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.count = 70;
    this.temperatureCelsius = 25;
    this.hudKineticEnergy = document.getElementById('hudKineticEnergy');
    this.hudLatticeState = document.getElementById('hudLatticeState');

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initParticles();
    this.animate();
  }

  resize() {
    if (!this.canvas || !this.canvas.parentElement) return;
    this.canvas.width = this.canvas.parentElement.clientWidth;
    this.canvas.height = this.canvas.parentElement.clientHeight || 180;
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.8,
        radius: Math.random() * 2.2 + 1.2,
        life: Math.random() * 100
      });
    }
  }

  setTemperature(celsius) {
    this.temperatureCelsius = celsius;
    const kelvin = celsius + 273.15;

    if (this.hudKineticEnergy) {
      this.hudKineticEnergy.textContent = `${kelvin.toFixed(1)} K EQUIV`;
    }

    if (this.hudLatticeState) {
      if (celsius <= -270) {
        this.hudLatticeState.textContent = 'CRYSTALLINE GROUND';
      } else if (celsius <= 0) {
        this.hudLatticeState.textContent = 'SOLID LATTICE / ICE';
      } else if (celsius < 100) {
        this.hudLatticeState.textContent = 'LIQUID MOLECULAR DIFFUSION';
      } else if (celsius < 1000) {
        this.hudLatticeState.textContent = 'VAPOR CONVECTIVE PLUMES';
      } else {
        this.hudLatticeState.textContent = 'HIGH-ENERGY PLASMA';
      }
    }
  }

  animate() {
    // Semi-transparent trailing background for persistence glow
    this.ctx.fillStyle = 'rgba(9, 11, 16, 0.32)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const c = this.temperatureCelsius;
    const isFrozen = c <= -270;
    const isCold = c < 0;
    const isBoiling = c >= 100;

    // Molecular speed scaling
    let speed = 1.0;
    let particleColor = '#ff9f1c'; // default warm amber

    if (isFrozen) {
      speed = 0.04;
      particleColor = '#38bdf8';
    } else if (isCold) {
      speed = 0.2 + ((c + 273.15) / 273.15) * 0.6;
      particleColor = '#2dd4bf';
    } else if (isBoiling) {
      speed = 2.0 + Math.min(6.0, (c - 100) / 200);
      particleColor = '#ff3838';
    } else {
      speed = 0.8 + (c / 100) * 0.8;
      particleColor = '#ffb703';
    }

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Vertical convective buoyancy when boiling
      if (isBoiling) {
        p.vy -= 0.05 * speed; // Rising thermal plume
        p.vx += (Math.random() - 0.5) * 0.4 * speed;
      }

      p.x += p.vx * speed;
      p.y += p.vy * speed;

      // Boundary bouncing or wrapping
      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      if (p.x > this.canvas.width) { p.x = this.canvas.width; p.vx *= -1; }

      if (isBoiling) {
        // Recycle to bottom if rising out of chamber
        if (p.y < 0) {
          p.y = this.canvas.height;
          p.x = Math.random() * this.canvas.width;
          p.vy = -Math.random() * 2;
        }
        if (p.y > this.canvas.height) { p.y = this.canvas.height; p.vy *= -0.8; }
      } else {
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > this.canvas.height) { p.y = this.canvas.height; p.vy *= -1; }
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = particleColor;
      this.ctx.shadowBlur = isBoiling ? 8 : 3;
      this.ctx.shadowColor = particleColor;
      this.ctx.fill();

      // Intermolecular bonds (crystal lattice when cold, collision cords when ambient)
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        const maxDist = isFrozen ? 95 : 45;

        if (dist < maxDist) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = particleColor;
          this.ctx.globalAlpha = (1 - dist / maxDist) * (isFrozen ? 0.65 : 0.2);
          this.ctx.lineWidth = isFrozen ? 1.4 : 0.8;
          this.ctx.stroke();
          this.ctx.globalAlpha = 1.0;
        }
      }
    }

    this.ctx.shadowBlur = 0;
    requestAnimationFrame(() => this.animate());
  }
}

window.ThermalParticleReactor = ThermalParticleReactor;
