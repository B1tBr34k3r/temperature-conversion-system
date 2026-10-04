# Temperature Conversion System — Milestone 2

**Authors:** Prakhar Harne & Naman Shrivastav  
**Milestone:** 2 — Core Module Implementation & Prototyping  
**Platform:** Modern Web Browser (HTML5, CSS3, ES6+ JavaScript)  

---

## 🎯 Milestone 2 Objectives & Completed Tasks

1. **Core Conversion Algorithms:**
   - High-precision bidirectional transformations across Celsius (°C), Fahrenheit (°F), and Kelvin (K).
   - Stabilization against IEEE 754 floating-point drift with scaled rounding and selectable precision (2, 4, 6, 8 decimal places or raw).

2. **Thermodynamic & Syntactic Input Validation:**
   - Multi-stage validation enforcing Absolute Zero physical boundaries (-273.15°C, -459.67°F, 0 K).
   - Strict numerical regex matching and finite number assertions.

3. **Interactive Web Prototype:**
   - Real-time conversion, manual convert button, scale inversion (swap), preset benchmark chips (Freezing, Boiling, Body Temp, Absolute Zero), one-click clipboard copying, and dynamic step-by-step mathematical derivation display.
   - Environmental physical state indicators (Sub-zero, room temperature, boiling, absolute zero).

4. **Incorporation of Milestone 1 Faculty & AI Feedback:**
   - **Rendered Visual UML Models:** Generated high-resolution graphics for Use Case Diagram, Class Diagram, Sequence Diagram, and Layered Architecture Diagram, embedded directly into the report.
   - **Comprehensive Risk Assessment:** Detailed mitigation matrix addressing browser compatibility, `localStorage` quota and private mode restrictions (with in-memory fallback), and IEEE 754 precision caveats.

5. **Automated Verification:**
   - 30 automated unit test assertions covering validation rules, physical boundaries, scientific reference benchmarks, and round-trip symmetry (100% pass rate).

---

## 📁 Repository Structure

```
SDMS/
├── diagrams/
│   ├── use_case_diagram.png          # Visual UML Use Case diagram
│   ├── class_diagram.png             # Visual UML Class diagram
│   ├── sequence_diagram.png          # Visual UML Sequence diagram
│   └── system_architecture.png       # Client-side 3-tier architecture diagram
├── prototype/
│   ├── index.html                    # Interactive web prototype UI
│   ├── styles.css                    # Modern responsive design & typography
│   ├── converter.js                  # Core modules (Validator, Converter, Explainer, Storage)
│   ├── tests.html                    # Visual in-browser unit test runner
│   └── test_runner.js                # Command-line automated unit test suite
├── build_milestone_2_report.py       # Automated DOCX report generator script
├── generate_diagrams.py              # Automated matplotlib UML diagram generator
├── Temperature_Conversion_System_Milestone_1_Polished_v2.docx
└── Temperature_Conversion_System_Milestone_2_Report.docx  # Final Milestone 2 Report
```

---

## 🚀 How to Run the Prototype

- **In the Browser:** Double-click or open `prototype/index.html` in any modern web browser.
- **Run Browser Tests:** Open `prototype/tests.html` in your browser.
- **Run CLI Unit Tests:** Run `node prototype/test_runner.js`.

---

## 📤 Submission Instructions for SDMS Portal

1. Open your Google Drive ([drive.google.com](https://drive.google.com)).
2. Upload `Temperature_Conversion_System_Milestone_2_Report.docx`.
3. Right-click the uploaded file in Google Drive, select **Share** -> Change General Access to **"Anyone with the link can view"** (Viewer permission).
4. Copy the file link.
5. Provide this link to the browser agent or paste it into the **Report File / Docs Link** field on SDMS Milestone 2 tab and click **Submit Report**.
