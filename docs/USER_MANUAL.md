# ThermaCraft: Scientific Temperature Conversion System
## Comprehensive User Manual & Operations Guide (Milestone 5)

**Authors:** Prakhar Harne (*BTCB26O1047*) & Naman Shrivastav  
**Institution:** Madhav Institute of Technology & Science, Gwalior (MITS-DU)  
**Project ID:** 5683 (SDMS Portal) | **Version:** v5.0.0 Production Release  

---

## 1. Introduction & Overview

ThermaCraft is a production-grade scientific temperature conversion web application designed to solve classical numerical drift, physical boundary violations, and O(N²) formula complexity in thermodynamic software.

### Key Capabilities
- **8 International Temperature Scales:** Celsius (°C), Fahrenheit (°F), Kelvin (K), Rankine (°R), Delisle (°De), Newton (°N), Réaumur (°Ré), and Rømer (°Rø).
- **Canonical Kelvin Pivot:** Conversions scale in O(2N) rather than O(N²), eliminating coupled formula errors.
- **Strict Physical Law Boundary:** Absolute Zero (0 K, -273.15 °C, -459.67 °F) strictly enforced before arithmetic computation.
- **Dynamic Mathematical Derivation:** Step-by-step human-readable formula breakdown for educational clarity.
- **Web Audio Kinetic Feedback:** Real-time acoustic frequency synthesis translating thermal energy into sound waves (100 Hz – 2000 Hz).
- **SQLite 3 WAL Persistence:** High-throughput conversion history with B-Tree indices and CSV/JSON streaming export.
- **Production Containerization:** Multi-stage Docker image (<95 MB) with automated health probes and PM2 clustering.

---

## 2. End-User Interactive Application Guide

### 2.1 Web Interface Layout
The user interface is accessible locally at `http://localhost:3000` or via any modern desktop/mobile web browser:
1. **Source & Destination Scale Selectors:** Dropdown menus allowing pairing of any 2 of the 8 supported scales.
2. **Numerical Input Field:** Accepts integer and floating-point scientific numbers.
3. **Scale Swap Inversion:** Click the dual-arrow swap button `⇄` to invert source and target scales with instantaneous re-computation.
4. **Precision Selector:** Choose between 2, 4, 6, 8 decimal places or full `raw` IEEE 754 precision.

### 2.2 Thermodynamic Preset Chips
Quick-click preset buttons load standard scientific thermodynamic benchmarks:
- **Absolute Zero (0 K):** The theoretical limit of zero thermal kinetic energy ($-273.15^\circ\text{C}$).
- **Freezing Point (0 °C):** Phase change threshold of pure water at 1 atm.
- **Human Body Temp (37 °C):** Average physiological core temperature ($98.6^\circ\text{F}$).
- **Boiling Point (100 °C):** Vaporization threshold of pure water ($212^\circ\text{F}$, $373.15\text{ K}$).
- **Sun Surface (5778 K):** Effective blackbody solar radiation temperature ($5504.85^\circ\text{C}$).

### 2.3 Environmental State Classification
Every calculation classifies the thermal milestone into physical states:
- `Absolute Zero` ($-273.15^\circ\text{C}$)
- `Cryogenic` ($< -150^\circ\text{C}$)
- `Freezing / Solid` ($0^\circ\text{C}$)
- `Room Comfort` ($20^\circ\text{C} - 25^\circ\text{C}$)
- `Human Body` ($36.5^\circ\text{C} - 37.5^\circ\text{C}$)
- `Boiling / Vapor` ($100^\circ\text{C}$)
- `Superheated Plasma` ($> 1000^\circ\text{C}$)

### 2.4 History Logging & Laboratory Data Export
- Every conversion is logged to the SQLite database.
- **Export CSV (`/api/export/csv`):** Formatted for direct import into Microsoft Excel, Python Pandas, or R.
- **Export JSON (`/api/export/json`):** Standard REST JSON array for integration with automated analysis pipelines.

---

## 3. DevOps & Administrator Operations Manual

### 3.1 Local Development Environment
```bash
# 1. Clone repository
git clone https://github.com/B1tBr34k3r/temperature-conversion-system.git
cd temperature-conversion-system

# 2. Install production dependencies
npm install

# 3. Run full automated verification test suite (110 tests)
npm test

# 4. Start local development server
npm start
# Server listens on http://localhost:3000
```

### 3.2 Docker Containerization
```bash
# Build production multi-stage Alpine container
docker build -t b1tbr34k3r/temperature-conversion-system:v5.0 .

# Run container with persistent host volume mapping
docker run -d -p 3000:3000 \
  -v sdms_sqlite_data:/app/server/data \
  --name sdms-app \
  b1tbr34k3r/temperature-conversion-system:v5.0

# Verify container health probe
curl http://localhost:3000/api/health
```

### 3.3 Docker Compose Multi-Service Launch
```bash
# Launch entire production stack in background
docker-compose up -d

# Check live logs
docker-compose logs -f

# Stop and gracefully unmount volumes
docker-compose down
```

### 3.4 Process Management with PM2
```bash
# Start cluster across all CPU cores
npx pm2 start ecosystem.config.js --env production

# Monitor status and memory
npx pm2 status
npx pm2 monit
```

---

## 4. REST API Endpoint Reference

| Method | Endpoint | Description | Request Payload / Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Diagnostic system health probe | None |
| `GET` | `/api/scales` | Metadata for all 8 temperature scales | None |
| `POST` | `/api/convert` | High-precision conversion & logging | `{ value: 100, fromScale: "C", toScale: "F", precision: "4" }` |
| `GET` | `/api/history` | Paginated conversion records | `?limit=50&offset=0` |
| `GET` | `/api/export/csv` | Download conversion history as CSV | None |
| `GET` | `/api/export/json` | Download conversion history as JSON | None |

---

## 5. Security & Reliability Highlights
- **Prepared Statements:** 100% immune to SQL injection through parameterized bindings (`better-sqlite3`).
- **DOM Injection Immunity:** DOM rendering uses textContent rather than innerHTML.
- **Resource Constraints:** Hard memory ceiling (512 MB) prevents memory exhaustion under heavy load.
