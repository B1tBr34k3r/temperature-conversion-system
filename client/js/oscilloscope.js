/**
 * Thermal Heat Flux Oscilloscope (HTML5 Canvas 2D)
 * Simulates real-time thermodynamic acoustic vibration & thermal energy waveforms.
 * Replaces generic particle animation with an authentic laboratory phosphor oscilloscope.
 * Authors: Prakhar Harne & Naman Shrivastav
 */

class ThermalOscilloscope {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.time = 0;
    this.celsius = 100;
    this.targetAmp = 25;
    this.currentAmp = 25;
    this.targetFreq = 0.03;
    this.currentFreq = 0.03;
    this.color = '#ff9f1c';

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    if (!this.canvas || !this.canvas.parentElement) return;
    this.canvas.width = this.canvas.parentElement.clientWidth;
    this.canvas.height = this.canvas.parentElement.clientHeight || 120;
  }

  setTemperature(celsius) {
    this.celsius = celsius;

    // Map temperature to wave amplitude, frequency, and phosphor color
    if (celsius <= -270) {
      // Near Absolute Zero: Flat ground state with minimal quantum jitter
      this.targetAmp = 2;
      this.targetFreq = 0.005;
      this.color = '#38bdf8';
    } else if (celsius <= 0) {
      // Sub-zero: Low frequency, crisp cold wave
      const ratio = (celsius + 273.15) / 273.15;
      this.targetAmp = 6 + ratio * 10;
      this.targetFreq = 0.01 + ratio * 0.015;
      this.color = '#2dd4bf';
    } else if (celsius <= 99) {
      // Ambient to Warm: Smooth resonant harmonic sine waves
      this.targetAmp = 18 + (celsius / 100) * 15;
      this.targetFreq = 0.025 + (celsius / 100) * 0.02;
      this.color = '#ff9f1c';
    } else {
      // Boiling / Extreme Heat: High-energy turbulent harmonics with secondary ripples
      this.targetAmp = Math.min(this.canvas.height * 0.38, 32 + (celsius - 100) * 0.05);
      this.targetFreq = 0.045 + Math.min(0.04, (celsius - 100) * 0.0001);
      this.color = '#ff3838';
    }
  }

  animate() {
    // Phosphor persistence decay
    this.ctx.fillStyle = 'rgba(10, 12, 18, 0.28)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw subtle oscilloscope grid lines
    this.drawGrid();

    // Smoothly interpolate amplitude and frequency towards target
    this.currentAmp += (this.targetAmp - this.currentAmp) * 0.08;
    this.currentFreq += (this.targetFreq - this.currentFreq) * 0.08;

    const midY = this.canvas.height / 2;
    const w = this.canvas.width;

    // Draw Primary Phosphor Wave
    this.ctx.beginPath();
    this.ctx.lineWidth = 2.2;
    this.ctx.strokeStyle = this.color;
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = this.color;

    for (let x = 0; x < w; x += 2) {
      // Primary wave + secondary harmonic ripple when warm/hot
      const primary = Math.sin(x * this.currentFreq + this.time) * this.currentAmp;
      let secondary = 0;
      if (this.celsius > 30) {
        secondary = Math.sin(x * this.currentFreq * 2.3 - this.time * 1.5) * (this.currentAmp * 0.35);
      }
      const y = midY + primary + secondary;
      if (x === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();

    // Draw faint ghost wave for vintage analog phosphor decay effect
    this.ctx.beginPath();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = this.color;
    this.ctx.globalAlpha = 0.25;
    for (let x = 0; x < w; x += 3) {
      const primary = Math.sin(x * this.currentFreq + (this.time - 0.2)) * (this.currentAmp * 0.85);
      const y = midY + primary;
      if (x === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();
    this.ctx.globalAlpha = 1.0;
    this.ctx.shadowBlur = 0;

    // Time step proportional to excitement
    this.time += 0.05 + this.currentFreq * 0.5;

    requestAnimationFrame(() => this.animate());
  }

  drawGrid() {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    this.ctx.lineWidth = 1;
    const step = 20;

    // Horizontal center line (dotted)
    this.ctx.setLineDash([2, 4]);
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvas.height / 2);
    this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }
}

window.ThermalOscilloscope = ThermalOscilloscope;
