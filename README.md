# TC-800 Laboratory Calibrator • Temperature Conversion System

An artisanal, high-precision scientific temperature conversion and thermal telemetry instrument built for students, researchers, and laboratory engineers. Designed with a distinct **tactile analog-digital hardware aesthetic**—combining a physical bench-instrument interface, an **Express.js REST API**, and an embedded **SQLite 3** relational database engine operating with Write-Ahead Logging (WAL mode).

---

## ✨ System Features & Tactile Hardware Design

- **Artisanal Analog-Digital Instrument Surface:**
  - **Damped Spring Galvanometer:** A physical analog needle driven by real spring-physics simulation (`F = -k*x - c*v`) that swings, overshoots, and dampens smoothly like a genuine bench galvanometer.
  - **Liquid Dispersion Mercury Column:** Vertical laboratory glass thermometer tube with dynamic fluid level, meniscus surface-tension bounce, and animated boiling bubbles when temperature passes $100^\circ\text{C}$.
  - **Dynamic Thermal Aura:** Adaptive ambient radiance that shifts between frosty cryogenic mist ($< 0^\circ\text{C}$), warm amber equilibrium ($0\text{--}99^\circ\text{C}$), and incandescent magma ($100^\circ\text{C}+$).
  - **Continuous Magnitude Scrubber:** Interactive tactile slider with real-time value scrubbing and physical audio ticks.
  - **Synthesized Mechanical Sound Design:** Tactile relay clicks, rotary switch clunks, and analog coil whines synthesized via the **Web Audio API** (zero external MP3/WAV assets).
  - **Vintage Phosphor Screen:** Warm amber phosphor digits with cathode ray scanlines and scientific 64-bit precision telemetry.

- **8-Scale Scientific Engine:** Accurate transformations across all primary thermodynamic and historical scales:
  - **Celsius (°C)**, **Fahrenheit (°F)**, **Kelvin (K)**
  - **Rankine (°R)**, **Delisle (°De)**, **Newton (°N)**
  - **Réaumur (°Ré)**, **Rømer (°Rø)**
- **Thermodynamic Limit Enforcement:** Enforces Absolute Zero lower boundaries ($-273.15^\circ\text{C}$, $-459.67^\circ\text{F}$, $0\text{ K}$, $0^\circ\text{R}$) with rigorous validation checks.
- **Kinetic Molecular Reactor (Canvas 2D):** A real-time molecular Brownian motion simulation that physically reacts to temperature: particles freeze into crystalline lattices at cryogenic temperatures and accelerate into buoyant convective plumes at elevated temperatures.
- **Embedded SQLite 3 Database:** Logs conversions with temporal indexing, providing analytical telemetry, historical review, and one-click **CSV/JSON export**.

---

## 🏗️ Full-Stack 3-Tier Architecture

```
┌────────────────────────────────────────────────────────┐
│     PRESENTATION TIER: TC-800 Laboratory Instrument    │
│  Tactile Bench Console • Spring Physics • Canvas 2D   │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / JSON REST API
┌───────────────────────────▼────────────────────────────┐
│      APPLICATION SERVER TIER: Express.js REST API      │
│  ConversionService (8 Scales) • ValidationService      │
└───────────────────────────┬────────────────────────────┘
                            │ Native Synchronous SQL & WAL
┌───────────────────────────▼────────────────────────────┐
│         PERSISTENCE TIER: Embedded SQLite 3 DB         │
│  Indexed 'conversions' Table • Temporal Analytics      │
└────────────────────────────────────────────────────────┘
```

### Full-Stack Architecture
![Full-Stack Architecture](diagrams/milestone3_architecture.png)

### Database Schema (SQLite 3)
![Database Schema](diagrams/db_schema_er.png)

### Live Laboratory Instrument Console
![Live Instrument Console](diagrams/milestone3_live_hud.png)

---

## 📁 Repository Structure

```
temperature-conversion-system/
├── client/                           # Tactile Laboratory Instrument Frontend
│   ├── index.html                    # TC-800 Hardware Console Layout
│   ├── css/
│   │   └── hud.css                   # Artisanal Milled Metal & Phosphor Styling
│   └── js/
│       ├── audio.js                  # Mechanical Relay & Analog Synthesizer
│       ├── particles.js              # Kinetic Brownian Convection Engine
│       ├── gauge.js                  # Spring-Physics Galvanometer & Liquid Tube
│       ├── api.js                    # REST API Client with Offline Fallback
│       └── app.js                    # Master Console Controller
├── server/                           # Express.js REST Backend
│   ├── config/
│   │   └── db.js                     # SQLite 3 Database & WAL Setup
│   ├── services/
│   │   ├── conversionService.js      # 8-Scale Scientific Engine
│   │   ├── validationService.js      # Thermodynamic Limits Checker
│   │   └── historyService.js         # Persistence & Export Logic
│   ├── routes/
│   │   └── api.js                    # REST Endpoints
│   └── server.js                     # Server Entry Point
├── diagrams/                         # Architectural & UML Diagrams
├── tests/
│   └── backend.test.js               # Automated Verification Suite (43 Tests)
├── package.json                      # Node.js Dependencies & Scripts
└── README.md                         # Project Documentation
```

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js** (v18.0 or newer recommended, v26.8+ tested)
- **npm** (included with Node.js)

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/B1tBr34k3r/temperature-conversion-system.git
cd temperature-conversion-system
npm install
```

### 2. Launch the Instrument Console
Start the integrated server:
```bash
npm start
```
Open your browser and navigate to:
```
http://localhost:3000
```

### 3. Run Automated Tests
Execute the automated test suite covering all 8 scales, thermodynamic bounds, and SQLite transactions:
```bash
npm test
```

---

## 👥 Authors & Credits

- **Prakhar Harne**
- **Naman Shrivastav**
