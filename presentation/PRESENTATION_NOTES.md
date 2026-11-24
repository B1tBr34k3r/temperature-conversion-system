# ThermaCraft • Final Project Presentation Speaker Notes & Viva Guide
## 15-Minute Technical Presentation Script

**Project:** Develop a Temperature Conversion System (ThermaCraft)  
**ID:** 5683 (SDMS Portal) | **Authors:** Prakhar Harne & Naman Shrivastav  
**Institution:** Madhav Institute of Technology & Science, Gwalior (MITS-DU)  

---

### Slide 1: Title & Introduction (1 Minute)
> *"Respected evaluators and faculty members, good morning/afternoon. Today, my teammate Naman Shrivastav and I, Prakhar Harne, are honored to present the final submission of our project: **ThermaCraft: A High-Precision Scientific Temperature Conversion System** under SDMS Project ID 5683. Over the course of five milestones, our objective was to transition from foundational requirement analysis to a production-grade, containerized software system that solves fundamental precision and physical boundary challenges in thermodynamic calculations."*

---

### Slide 2: Problem Space & Motivation (2 Minutes)
> *"When building scientific software, naive implementation of temperature conversion introduces severe flaws:
> 1. **IEEE-754 Floating Point Drift:** Binary fractions cause cumulative rounding errors. In laboratory telemetry, rounding errors compound over iterations.
> 2. **Physical Boundary Violations:** Many web converters happily convert -300 °C or -50 Kelvin. In physics, Absolute Zero is an unbreakable lower asymptote.
> 3. **Algorithmic Explosion (O(N²)):** When supporting 8 scales, paired formula implementation requires 56 separate conversion functions. This is unmaintainable and error-prone.
> ThermaCraft was engineered from the ground up to solve these three specific problems."*

---

### Slide 3: 3-Tier Enterprise Architecture (2 Minutes)
> *"To ensure robustness, we implemented a strictly decoupled 3-Tier Enterprise Architecture:
> - **Presentation Tier:** A responsive web SPA built with modern ES6, CSS Design Tokens, and an HTML5 dynamic Canvas gauge.
> - **Business Logic Tier:** An Express.js 5 / Node.js 20 REST API featuring strict input sanitization, mathematical derivation formatting, and automated `/api/health` probes.
> - **Data Persistence Tier:** An ACID-compliant SQLite 3 relational database utilizing Write-Ahead Logging (WAL) mode for lock-free concurrent writes and sub-millisecond query performance."*

---

### Slide 4: Algorithmic Core: Canonical Kelvin Pivot (2 Minutes)
> *"Our primary algorithmic innovation is the **Canonical Kelvin Pivot**:
> Instead of mapping 56 direct conversion formulas, every scale converts first to Kelvin (the SI base unit), and then from Kelvin to the target unit.
> This reduces function complexity from $O(N^2)$ to $O(2N)$—just 16 clean transformations.
> Furthermore, it centralizes our Absolute Zero checks into a single mathematical invariant and guarantees strict inverse round-trip symmetry across all 56 permutation vectors with precision loss $\le 10^{-9}$."*

---

### Slide 5: Technical & Educational Innovations (2 Minutes)
> *"Beyond numerical computation, ThermaCraft delivers rich educational features:
> 1. **Web Audio Energy Synthesis:** Thermal energy is kinetic motion. We translate thermal magnitudes into audio frequencies (100 Hz to 2000 Hz) using the Web Audio API oscillator, providing sensory reinforcement of heat changes.
> 2. **Step-by-Step Derivation:** The UI renders the exact algebraic steps with fractions and thermodynamic constants.
> 3. **Thermal Milestone Indicators:** The engine automatically tags values into real-world environmental states like Cryogenic, Room Comfort, Human Body, or Superheated."*

---

### Slide 6: Production Containerization & Deployment (2 Minutes)
> *"For Milestone 5, we packaged the system into full production infrastructure:
> - **Multi-Stage Dockerfile:** Built on Alpine Linux, stripping development tools to deliver a secure container under 95 MB running under a non-root `appuser`.
> - **Docker Compose Orchestration:** Features named persistent volume mapping for our SQLite WAL database, ensuring data survives container restarts.
> - **Process Clustering:** Configured via PM2 (`ecosystem.config.js`) for multi-core clustering and automatic memory threshold restarts."*

---

### Slide 7: Quality Assurance & 110 Automated Tests (2 Minutes)
> *"Our engineering is backed by an exhaustive QA hierarchy comprising **110 automated assertions with a 100% pass rate**:
> - **Tier 1 (Unit & Symmetry):** 21 tests verifying 56 round-trip scale pairs.
> - **Tier 2 (Integration & Database):** 10 tests proving SQLite WAL mode transactional integrity.
> - **Tier 3 (Stress Benchmarks):** 100,000 conversions completed in 24.2 ms (~4.16 million ops/sec).
> - **Tier 4 (Security Fuzzing):** 20 aggressive attacks including SQL injection payloads, XSS tokens, and NaN values, all neutralized safely."*

---

### Slide 8: Live Demonstration & Viva Voce Q&A (2 Minutes)
> *"We now invite the panel to observe the live demonstration:
> 1. Performing real-time conversions and swapping scales.
> 2. Demonstrating the Web Audio frequency feedback.
> 3. Inspecting the step-by-step formula derivation.
> 4. Querying the `/api/health` diagnostic probe.
> 5. Exporting conversion logs to CSV and JSON.
> We are now open for technical questions from the faculty panel. Thank you."*
