/**
 * Kinetic Molecular Thermal Reactor (HTML5 Canvas 2D)
 * Simulates thermodynamic Brownian motion reacting in real-time to temperature.
 * Milestone 3: Mind-Blowing Visual Element
 */

class ThermalParticleReactor {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.count = 65;
    this.temperatureCelsius = 25; // default room temp
    this.targetSpeed = 1.0;
    this.colorTheme = '#00f0ff';
    this.animationId = null;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initParticles();
    this.animate();
  }

  resize() {
    this.canvas.width = this.canvas.parentElement.clientWidth;
    this.canvas.height = this.canvas.parentElement.clientHeight || 180;
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2.5 + 1.2,
        energy: Math.random()
      });
    }
  }

  setTemperature(celsius) {
    this.temperatureCelsius = celsius;
    // Map temperature to molecular kinetic speed
    if (celsius <= -270) {
      this.targetSpeed = 0.05; // Absolute zero freeze
      this.colorTheme = '#00f0ff';
    } else if (celsius <= 0) {
      this.targetSpeed = 0.4 + (celsius + 273.15) / 500;
      this.colorTheme = '#38bdf8';
    } else if (celsius <= 100) {
      this.targetSpeed = 0.8 + (celsius / 100) * 1.5;
      this.colorTheme = '#10b981';
    } else if (celsius <= 1000) {
      this.targetSpeed = 2.5 + (celsius / 500);
      this.colorTheme = '#f59e0b';
    } else {
      this.targetSpeed = 5.0; // Plasma excitation
      this.colorTheme = '#ff0055';
    }
  }

  animate() {
    this.ctx.fillStyle = 'rgba(5, 8, 17, 0.28)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const speed = this.targetSpeed;
    const isFrozen = this.temperatureCelsius <= -270;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx * speed;
      p.y += p.vy * speed;

      // Bounce off walls
      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      if (p.x > this.canvas.width) { p.x = this.canvas.width; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      if (p.y > this.canvas.height) { p.y = this.canvas.height; p.vy *= -1; }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.colorTheme;
      this.ctx.shadowBlur = speed * 4 + 4;
      this.ctx.shadowColor = this.colorTheme;
      this.ctx.fill();

      // Draw crystal bonds if near absolute zero, or molecular collision links if ambient
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        const maxDist = isFrozen ? 90 : 55;

        if (dist < maxDist) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = this.colorTheme;
          this.ctx.globalAlpha = (1 - dist / maxDist) * (isFrozen ? 0.6 : 0.25);
          this.ctx.lineWidth = isFrozen ? 1.2 : 0.7;
          this.ctx.stroke();
          this.ctx.globalAlpha = 1.0;
        }
      }
    }

    this.ctx.shadowBlur = 0;
    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

window.ThermalParticleReactor = ThermalParticleReactor;
