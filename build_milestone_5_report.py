import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
import os

def create_milestone_5_report():
    doc = docx.Document()

    # 1-inch margins all around
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Base Typography Styling
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

    def set_cell_background(cell, color_hex):
        shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
        cell._tc.get_or_add_tcPr().append(shading)

    def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = OxmlElement('w:tcMar')
        for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
            node = OxmlElement(f'w:{m}')
            node.set(qn('w:w'), str(val))
            node.set(qn('w:type'), 'dxa')
            tcMar.append(node)
        tcPr.append(tcMar)

    def keep_table_on_single_page(table):
        """
        Enforces OpenXML rules so the table renders completely on 1 single page:
        1. cantSplit on every row: prevents any individual row from splitting across a page.
        2. tblHeader on row 0: repeats header cleanly if ever required.
        3. keep_with_next on all paragraphs of all rows except the last row.
        """
        for r_idx, row in enumerate(table.rows):
            trPr = row._tr.get_or_add_trPr()
            trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
            if r_idx == 0:
                trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))
            
            if r_idx < len(table.rows) - 1:
                for cell in row.cells:
                    for p in cell.paragraphs:
                        p.paragraph_format.keep_with_next = True

    def add_heading_1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(16)
        p.paragraph_format.space_after = Pt(5)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(14.5)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A) # Deep Navy
        return p

    def add_heading_2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(11)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(12)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x25, 0x63, 0xEB) # Royal Blue
        return p

    def add_heading_3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x0F, 0x76, 0x6E) # Teal
        return p

    def add_para(text, bold_prefix=None, space_after=5, keep_with_next=False):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.15
        if keep_with_next:
            p.paragraph_format.keep_with_next = True
        if bold_prefix:
            run_b = p.add_run(bold_prefix)
            run_b.font.name = 'Calibri'
            run_b.font.size = Pt(10.5)
            run_b.font.bold = True
            run_b.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(10.5)
        run.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
        return p

    def add_bullet(bold_prefix, text, space_after=3):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.12
        run_b = p.add_run(bold_prefix + " ")
        run_b.font.name = 'Calibri'
        run_b.font.size = Pt(10.5)
        run_b.font.bold = True
        run_b.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(10.5)
        run.font.color.rgb = RGBColor(0x47, 0x55, 0x69)
        return p

    def add_figure(img_path, caption_text, width=Inches(6.4)):
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(8)
            p_img.paragraph_format.space_after = Pt(4)
            p_img.paragraph_format.keep_with_next = True
            p_img.add_run().add_picture(img_path, width=width)

            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_after = Pt(10)
            p_cap.paragraph_format.keep_with_next = False
            run_cap = p_cap.add_run(caption_text)
            run_cap.font.name = 'Calibri'
            run_cap.font.size = Pt(9.5)
            run_cap.font.italic = True
            run_cap.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    # =========================================================================
    # DOCUMENT HEADER & METADATA BLOCK
    # =========================================================================
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(2)
    p_title.paragraph_format.keep_with_next = True
    r_sub = p_title.add_run("MADHAV INSTITUTE OF TECHNOLOGY & SCIENCE, GWALIOR (MITS-DU)\n")
    r_sub.font.name = 'Calibri'
    r_sub.font.size = Pt(11)
    r_sub.font.bold = True
    r_sub.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    r_main = p_title.add_run("ThermaCraft: Scientific Temperature Conversion System\n")
    r_main.font.name = 'Calibri'
    r_main.font.size = Pt(18)
    r_main.font.bold = True
    r_main.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    r_tag = p_title.add_run("MILESTONE 5 FINAL PROJECT REPORT: DOCUMENTATION, DEPLOYMENT & VIVA DEFENSE")
    r_tag.font.name = 'Calibri'
    r_tag.font.size = Pt(11.5)
    r_tag.font.bold = True
    r_tag.font.color.rgb = RGBColor(0x05, 0x96, 0x69) # Emerald Green

    # Metadata Table
    meta_table = doc.add_table(rows=5, cols=4)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False

    meta_data = [
        [("Project Title:", True), ("Develop a Temperature Conversion System", False), ("Project ID:", True), ("5683 (SDMS Portal)", False)],
        [("Lead Author:", True), ("Prakhar Harne (BTCB26O1047)", False), ("Co-Author:", True), ("Naman Shrivastav", False)],
        [("Department / Sem:", True), ("Computer Science & Technology (CST) / VII", False), ("Academic Session:", True), ("July–Dec 2026", False)],
        [("Repository URL:", True), ("github.com/B1tBr34k3r/temperature-conversion-system", False), ("Current Version:", True), ("v5.0.0 Production Release", False)],
        [("Evaluation Date:", True), ("November 28, 2026 (Final Deliverable)", False), ("Institutional Status:", True), ("Final Submission / Viva Ready", False)]
    ]

    col_widths = [Inches(1.4), Inches(2.1), Inches(1.3), Inches(1.7)]
    for r_idx, row in enumerate(meta_table.rows):
        for c_idx, cell in enumerate(row.cells):
            cell.width = col_widths[c_idx]
            label, is_bold = meta_data[r_idx][c_idx]
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            run = p.add_run(label)
            run.font.name = 'Calibri'
            run.font.size = Pt(9.5)
            if is_bold:
                run.font.bold = True
                run.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
                set_cell_background(cell, "F1F5F9")
            else:
                run.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
                set_cell_background(cell, "FFFFFF")
            set_cell_margins(cell, top=60, bottom=60, left=100, right=100)

    keep_table_on_single_page(meta_table)

    # =========================================================================
    # SECTION 1: EXECUTIVE SUMMARY & SYSTEM EVOLUTION
    # =========================================================================
    add_heading_1("1. Executive Summary & Full Project Lifecycle")
    add_para(
        "The ThermaCraft Temperature Conversion System is a production-grade, full-stack scientific application designed "
        "and implemented to solve foundational computational challenges in thermodynamic conversion software. Standard "
        "conversion utilities routinely suffer from cumulative IEEE 754 floating-point drift, unphysical calculations "
        "below Absolute Zero (0 Kelvin), unmaintainable O(N²) paired formula logic, and opaque black-box user interfaces. "
        "ThermaCraft addresses each limitation through a mathematically verified Canonical Kelvin Pivot architecture, an "
        "enterprise 3-tier decoupled topology, an ACID-compliant SQLite 3 persistence engine operating in Write-Ahead Logging "
        "(WAL) mode, and a tactile, educational frontend featuring real-time Web Audio acoustic feedback."
    )
    add_para(
        "This Milestone 5 deliverable represents the culmination of all five developmental phases tracked on the MITS "
        "Skills Development Monitoring System (SDMS Project 5683). The system has matured through rigorous peer and faculty "
        "evaluations: Milestone 1 (Requirement Analysis & Architecture - 6/8 Marks), Milestone 2 (Core Module Prototyping - "
        "5/8 Marks), Milestone 3 (Full-Stack 3-Tier Integration - 6/8 Marks), Milestone 4 (Comprehensive QA, 110 Automated "
        "Tests, 100k Ops Stress Benchmarks, SQLi/XSS Fuzzing - 100% Pass), and Milestone 5 (Production Containerization, "
        "Cloud Infrastructure, User/Operations Manuals, and Viva Voce Defense Preparation)."
    )

    add_figure("diagrams/milestone5_project_evolution_lifecycle.png", 
               "Figure 1: Complete Five-Milestone Lifecycle, Architectural Evolution, and Verification Metrics")

    # Table 1: Milestone Evolution Matrix
    add_heading_2("Table 1: Project Milestone Traceability & Evaluation Ledger")
    m_headers = ["Phase", "Milestone Focus", "Primary Deliverables", "QA / Verification Metric", "SDMS Status"]
    m_rows = [
        ["Milestone 1", "Requirement Analysis & Design", "Formal SRS, MVC Architecture, UML Diagrams, Tech Stack Selection", "Traceability Matrix Linking Specs to UML", "Evaluated (6/8 Marks)"],
        ["Milestone 2", "Core Algorithms & Prototype", "Triple-Scale Engine (C, F, K), IEEE 754 Precision, Absolute Zero Limits", "30 Unit Assertions (100% Pass Rate)", "Evaluated (5/8 Marks)"],
        ["Milestone 3", "3-Tier System & Database", "Express REST API, 8 Scales, SQLite WAL Engine, Web Audio API, CSV/JSON", "43 Passing Tests, WAL Concurrency Proofs", "Evaluated (6/8 Marks)"],
        ["Milestone 4", "Testing & Optimization", "110-Test QA Suite, 56-Vector Inverse Symmetry, 100k Stress, Security Matrix", "110 Tests (100% Pass), Zero SQLi/XSS Vulnerability", "Verified Complete"],
        ["Milestone 5", "Deployment & Final Defense", "Docker Multi-Stage, Compose Volume, PM2 Cluster, User Manual, Viva Deck", "Automated /api/health Probes, Cloud CI/CD", "Current Deliverable"]
    ]
    m_table = doc.add_table(rows=len(m_rows) + 1, cols=len(m_headers))
    m_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    m_table.autofit = False

    t1_widths = [Inches(1.0), Inches(1.5), Inches(2.2), Inches(1.1), Inches(0.7)]
    for c_idx, title in enumerate(m_headers):
        cell = m_table.rows[0].cells[c_idx]
        cell.width = t1_widths[c_idx]
        p = cell.paragraphs[0]
        run = p.add_run(title)
        run.font.bold = True
        run.font.size = Pt(9.0)
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        set_cell_background(cell, "1E3A8A")
        set_cell_margins(cell, top=70, bottom=70, left=80, right=80)

    for r_idx, row_data in enumerate(m_rows):
        row = m_table.rows[r_idx + 1]
        bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.width = t1_widths[c_idx]
            p = cell.paragraphs[0]
            run = p.add_run(val)
            run.font.size = Pt(8.5)
            if c_idx == 0 or c_idx == 4:
                run.font.bold = True
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=50, bottom=50, left=70, right=70)

    keep_table_on_single_page(m_table)

    # =========================================================================
    # SECTION 2: SOFTWARE REQUIREMENTS SPECIFICATION & TRACEABILITY
    # =========================================================================
    add_heading_1("2. Software Requirements Specification (SRS) & Architecture")
    add_para(
        "The system adheres strictly to IEEE 830-1998 Software Requirements Specifications standards. All user requirements "
        "are categorized into Functional Requirements (FR) and Non-Functional Requirements (NFR), with explicit bidirectional "
        "traceability to architectural components, automated test cases, and deployment configurations."
    )

    add_bullet("FR-01: Universal Multi-Scale Conversion Engine:", 
               "System supports eight international thermodynamic scales: Celsius (°C), Fahrenheit (°F), Kelvin (K), "
               "Rankine (°R), Delisle (°De), Newton (°N), Réaumur (°Ré), and Rømer (°Rø). All conversions route through "
               "a central Kelvin pivot, achieving exact O(2N) scaling rather than O(N²) paired algorithmic explosion.")
    add_bullet("FR-02: Physical Law Boundary Enforcement:", 
               "Input validation strictly rejects any temperature value below Absolute Zero (0 K, -273.15 °C, -459.67 °F). "
               "The validation layer intercepts malformed scientific entries prior to database or mathematical processing.")
    add_bullet("FR-03: Dynamic Formula Derivation & Step-by-Step Breakdown:", 
               "Provides transparent, human-readable intermediate calculation steps showing exact algebraic fractions and "
               "thermodynamic constants (e.g., [K] = ([°F] + 459.67) × 5/9).")
    add_bullet("FR-04: Environmental Thermal Milestone Classification:", 
               "Categorizes calculated values into distinct physical states: Absolute Zero (-273.15°C), Cryogenic (<-150°C), "
               "Freezing (0°C), Room Comfort (20–25°C), Human Body (37°C), Boiling (100°C), and Superheated (>100°C).")
    add_bullet("FR-05: High-Throughput SQLite Persistence & History Engine:", 
               "Logs all conversions asynchronously into a lightweight, zero-configuration SQLite database operating in "
               "Write-Ahead Logging (WAL) mode with compound B-Tree indexing on timestamp and scale pairs.")
    add_bullet("FR-06: Multi-Format Data Portability (CSV & JSON Streaming):", 
               "Exposes streaming endpoints (/api/export/csv and /api/export/json) allowing laboratory and classroom export.")
    add_bullet("FR-07: Psychoacoustic Feedback via Web Audio API:", 
               "Translates thermal energy magnitudes into dynamic audio frequencies (100 Hz to 2000 Hz) using clean sine-wave "
               "synthesis, delivering multi-sensory educational reinforcement.")
    add_bullet("FR-08: Containerized Health Probes & System Telemetry:", 
               "Exposes an automated diagnostic health probe (/api/health) delivering real-time metrics on process uptime, "
               "database connection state, memory utilization, and active conversion engine status.")

    add_heading_2("Table 2: Requirements Traceability Matrix (RTM)")
    rtm_headers = ["Req ID", "Requirement Description", "Architectural Module", "Automated QA Verification", "Deployment Spec"]
    rtm_rows = [
        ["FR-01", "8-Scale Conversion Pivot", "ConversionService.js", "Tests #1–21 (56 Inverse Symmetry Vectors)", "Docker Runner"],
        ["FR-02", "Absolute Zero Boundary", "ValidationService.js", "Tests #68–74 (Boundaries & Sub-Zero Rejection)", "API Middleware"],
        ["FR-03", "Formula Derivation", "ConversionService.getFormula", "Tests #108–110 (Traceability Matrix)", "Client UI SPA"],
        ["FR-05", "SQLite WAL Persistence", "server/config/db.js", "Tests #44–53 (WAL Concurrency & Schema)", "Named Volume Mount"],
        ["FR-06", "CSV / JSON Export", "HistoryService.js", "Tests #52–53 (RFC 4180 Streaming Formats)", "Nginx Gzip Proxy"],
        ["FR-08", "System Health Telemetry", "routes/api.js (/health)", "Tests #44 (HTTP 200 Status & Metrics)", "Docker HEALTHCHECK"]
    ]
    rtm_table = doc.add_table(rows=len(rtm_rows) + 1, cols=len(rtm_headers))
    rtm_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    rtm_table.autofit = False

    t2_widths = [Inches(0.8), Inches(1.8), Inches(1.5), Inches(1.4), Inches(1.0)]
    for c_idx, title in enumerate(rtm_headers):
        cell = rtm_table.rows[0].cells[c_idx]
        cell.width = t2_widths[c_idx]
        p = cell.paragraphs[0]
        run = p.add_run(title)
        run.font.bold = True
        run.font.size = Pt(9.0)
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        set_cell_background(cell, "1E3A8A")
        set_cell_margins(cell, top=70, bottom=70, left=80, right=80)

    for r_idx, row_data in enumerate(rtm_rows):
        row = rtm_table.rows[r_idx + 1]
        bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.width = t2_widths[c_idx]
            p = cell.paragraphs[0]
            run = p.add_run(val)
            run.font.size = Pt(8.5)
            if c_idx == 0:
                run.font.bold = True
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=50, bottom=50, left=70, right=70)

    keep_table_on_single_page(rtm_table)

    # =========================================================================
    # SECTION 3: SYSTEM ARCHITECTURE & DATABASE SCHEMA
    # =========================================================================
    add_heading_1("3. System Architecture & Database Design")
    add_para(
        "The system is organized around a strictly decoupled Three-Tier Enterprise Architecture: Presentation Layer (Tactile "
        "Web SPA), Business Logic & API Service Layer (Express.js 5 / Node.js 20), and Data Persistence Layer (SQLite 3 with WAL). "
        "This architectural choice ensures complete independence of concerns: the mathematical calculation algorithms remain "
        "wholly decoupled from UI presentation logic and database storage drivers."
    )

    add_heading_2("Table 3: SQLite 3 Database Schema & Indexing Specifications")
    db_headers = ["Field Name", "Data Type", "Constraints / Attributes", "Technical Description"]
    db_rows = [
        ["id", "INTEGER", "PRIMARY KEY AUTOINCREMENT", "Unique monotonic conversion record identifier."],
        ["input_value", "REAL", "NOT NULL", "Original source temperature numerical magnitude."],
        ["from_scale", "TEXT (2)", "NOT NULL", "Source scale identifier (C, F, K, R, De, N, Re, Ro)."],
        ["result_value", "REAL", "NOT NULL", "Target scale converted magnitude."],
        ["to_scale", "TEXT (2)", "NOT NULL", "Target scale identifier (C, F, K, R, De, N, Re, Ro)."],
        ["precision_setting", "TEXT (10)", "DEFAULT '4'", "Active rounding precision (2, 4, 6, 8, or 'raw')."],
        ["formula", "TEXT", "NOT NULL", "Human-readable mathematical derivation breakdown."],
        ["physical_state", "TEXT (50)", "NULL", "Thermal milestone classification (e.g., Boiling, Cryogenic)."],
        ["client_ip", "TEXT (45)", "NULL", "Client IP address for telemetry and security logging."],
        ["timestamp", "DATETIME", "DEFAULT CURRENT_TIMESTAMP", "UTC conversion execution timestamp."],
        ["idx_timestamp", "INDEX", "CREATE INDEX ON conversions(timestamp DESC)", "Optimizes chronological history query pagination."],
        ["idx_scales", "INDEX", "CREATE INDEX ON conversions(from_scale, to_scale)", "Accelerates analytical scale telemetry queries."]
    ]
    db_table = doc.add_table(rows=len(db_rows) + 1, cols=len(db_headers))
    db_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    db_table.autofit = False

    t3_widths = [Inches(1.3), Inches(1.1), Inches(2.2), Inches(1.9)]
    for c_idx, title in enumerate(db_headers):
        cell = db_table.rows[0].cells[c_idx]
        cell.width = t3_widths[c_idx]
        p = cell.paragraphs[0]
        run = p.add_run(title)
        run.font.bold = True
        run.font.size = Pt(9.0)
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        set_cell_background(cell, "1E3A8A")
        set_cell_margins(cell, top=70, bottom=70, left=80, right=80)

    for r_idx, row_data in enumerate(db_rows):
        row = db_table.rows[r_idx + 1]
        bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.width = t3_widths[c_idx]
            p = cell.paragraphs[0]
            run = p.add_run(val)
            run.font.size = Pt(8.5)
            if c_idx == 0:
                run.font.bold = True
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=45, bottom=45, left=60, right=60)

    keep_table_on_single_page(db_table)

    # =========================================================================
    # SECTION 4: PRODUCTION CONTAINERIZATION & DEPLOYMENT SETUP
    # =========================================================================
    add_heading_1("4. Production Deployment & Containerization Infrastructure")
    add_para(
        "A critical requirement for Milestone 5 is delivering comprehensive local and cloud deployment infrastructure. "
        "The project provides a multi-stage production Dockerfile, a declarative Docker Compose orchestration stack, "
        "an enterprise PM2 cluster process management file, and cloud-ready infrastructure specifications."
    )

    add_figure("diagrams/milestone5_deployment_architecture.png", 
               "Figure 2: Production Multi-Tier Containerization, Health Monitoring, and Cloud Deployment Architecture")

    add_heading_2("4.1 Multi-Stage Dockerfile Architecture")
    add_para(
        "To achieve maximum security, minimal disk footprint, and zero dev-dependency bloat, the container is built using a "
        "two-stage Docker architecture based on Alpine Linux 3.19:"
    )
    add_bullet("Stage 1 (Build & Compilation):", 
               "Installs Python3, Make, and GCC build tools required to compile native SQLite C bindings (better-sqlite3) "
               "against musl libc, executing 'npm ci --only=production' to isolate runtime artifacts.")
    add_bullet("Stage 2 (Runtime Image):", 
               "Copies only compiled production modules and source code into a clean Node.js 20 Alpine base. Creates an "
               "isolated, non-privileged system user ('appuser' in group 'appgroup'), drops root permissions, configures "
               "persistent volume permissions for '/app/server/data', and registers an automated HEALTHCHECK probe.")

    add_heading_2("4.2 Docker Compose Orchestration & Persistent Volume Management")
    add_para(
        "The application orchestration is defined in 'docker-compose.yml', ensuring deterministic environment reproduction "
        "across developer workstations, CI/CD runners, and institutional servers:"
    )
    add_bullet("Named Persistent Storage Volume:", 
               "The SQLite database directory ('/app/server/data') is mapped to host volume 'sdms_conversions_sqlite_volume', "
               "guaranteeing full data durability across container restarts, image upgrades, and deployments.")
    add_bullet("Resource Constraints & QoS:", 
               "Enforces a hard memory ceiling of 512 MB and 1.0 CPU limit, with a baseline reservation of 128 MB RAM and 0.2 CPU, "
               "preventing resource starvation in multi-tenant college server environments.")
    add_bullet("Automated Health Probes:", 
               "The container manager executes curl probes against 'http://localhost:3000/api/health' every 30 seconds. If three "
               "consecutive probes fail, Docker automatically triggers health alerts and restarts the container.")

    add_heading_2("Table 4: Production Deployment Configuration Matrix")
    dep_headers = ["Deployment Strategy", "Target Platform", "Configuration Artifact", "Operational Characteristics"]
    dep_rows = [
        ["Containerized (Primary)", "Docker / Docker Compose", "Dockerfile, docker-compose.yml", "Multi-stage Alpine build (<95 MB), non-root appuser, persistent named volume."],
        ["Process Clustering (Node)", "Bare-Metal Linux / VPS", "ecosystem.config.js (PM2)", "Cluster mode on all CPU cores, auto-restart on memory limit (>300M), log rotation."],
        ["Managed Cloud Container", "Render Cloud (PaaS)", "render.yaml", "Automated GitHub branch deploys, persistent SSD disk (1GB), zero-downtime rolling deploys."],
        ["Serverless Edge Platform", "Vercel / AWS Lambda", "vercel.json", "Serverless function routing for /api/* with static asset edge caching on global CDN."],
        ["Local Developer Server", "Workstation (Node 20+)", "npm start (server/server.js)", "Zero-setup local development server with Express static file serving on localhost:3000."]
    ]
    dep_table = doc.add_table(rows=len(dep_rows) + 1, cols=len(dep_headers))
    dep_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    dep_table.autofit = False

    t4_widths = [Inches(1.5), Inches(1.3), Inches(1.6), Inches(2.1)]
    for c_idx, title in enumerate(dep_headers):
        cell = dep_table.rows[0].cells[c_idx]
        cell.width = t4_widths[c_idx]
        p = cell.paragraphs[0]
        run = p.add_run(title)
        run.font.bold = True
        run.font.size = Pt(9.0)
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        set_cell_background(cell, "1E3A8A")
        set_cell_margins(cell, top=70, bottom=70, left=80, right=80)

    for r_idx, row_data in enumerate(dep_rows):
        row = dep_table.rows[r_idx + 1]
        bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.width = t4_widths[c_idx]
            p = cell.paragraphs[0]
            run = p.add_run(val)
            run.font.size = Pt(8.5)
            if c_idx == 0:
                run.font.bold = True
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=50, bottom=50, left=70, right=70)

    keep_table_on_single_page(dep_table)

    # =========================================================================
    # SECTION 5: COMPREHENSIVE TESTING & QA AUDIT (110 TESTS)
    # =========================================================================
    add_heading_1("5. Quality Assurance & Testing Audit (110 Tests Verified)")
    add_para(
        "The project implements a rigorous, four-tier testing hierarchy spanning 110 automated assertions covering mathematical "
        "accuracy, inverse round-trip symmetry across all 56 permutation pairs, SQLite database WAL transactional integrity, "
        "stress benchmarks (100,000 continuous operations), and aggressive security fuzzing against SQL injection and cross-site scripting."
    )

    add_heading_2("Table 5: QA Testing Audit Breakdown & Assertion Ledger")
    qa_headers = ["Testing Tier", "Test Suite Scope", "Assertions Executed", "Passing Rate", "Execution Time"]
    qa_rows = [
        ["Tier 1: Unit & Symmetries", "8 Scales, 56 Round-Trip Symmetries, IEEE-754 Clamping", "21 Assertions", "100.0% (21/21 Pass)", "2.1 ms"],
        ["Tier 2: API & Integration", "REST Endpoints, JSON Schemas, SQLite WAL Persistence", "10 Assertions", "100.0% (10/10 Pass)", "14.8 ms"],
        ["Tier 3: Stress Benchmarks", "100,000 Conversions Throughput & WAL Concurrency", "5 Benchmarks", "100.0% (5/5 Pass)", "24.2 ms (~4.16M ops/sec)"],
        ["Tier 4: Security Fuzzing", "SQLi Attack Vectors, XSS Sanitization, Boundary Clamping", "20 Assertions", "100.0% (20/20 Pass)", "4.3 ms"],
        ["Backend Core Suite", "Full-Stack Integration, Validation, CSV/JSON Export", "54 Assertions", "100.0% (54/54 Pass)", "18.6 ms"]
    ]
    qa_table = doc.add_table(rows=len(qa_rows) + 1, cols=len(qa_headers))
    qa_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    qa_table.autofit = False

    t5_widths = [Inches(1.4), Inches(2.2), Inches(1.1), Inches(1.0), Inches(0.8)]
    for c_idx, title in enumerate(qa_headers):
        cell = qa_table.rows[0].cells[c_idx]
        cell.width = t5_widths[c_idx]
        p = cell.paragraphs[0]
        run = p.add_run(title)
        run.font.bold = True
        run.font.size = Pt(9.0)
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        set_cell_background(cell, "1E3A8A")
        set_cell_margins(cell, top=70, bottom=70, left=80, right=80)

    for r_idx, row_data in enumerate(qa_rows):
        row = qa_table.rows[r_idx + 1]
        bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.width = t5_widths[c_idx]
            p = cell.paragraphs[0]
            run = p.add_run(val)
            run.font.size = Pt(8.5)
            if c_idx == 0 or c_idx == 3:
                run.font.bold = True
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=50, bottom=50, left=70, right=70)

    keep_table_on_single_page(qa_table)

    # =========================================================================
    # SECTION 6: USER MANUAL & OPERATIONS GUIDE
    # =========================================================================
    add_heading_1("6. Comprehensive User Manual & Operations Guide")
    add_para(
        "This section serves as the complete operational handbook for end-users (students, laboratory instructors, researchers) "
        "and DevOps system administrators."
    )

    add_heading_2("6.1 End-User Interactive Application Guide")
    add_bullet("1. Scale Selection & Value Entry:", 
               "Open the application in any modern web browser. Select the source temperature scale using the 'From' dropdown "
               "(e.g., Celsius) and destination scale using the 'To' dropdown (e.g., Fahrenheit). Enter a numerical magnitude.")
    add_bullet("2. Rapid Scientific Presets:", 
               "Click any preset chip to load standard thermodynamic reference benchmarks: Absolute Zero (0 K), Freezing (0 °C), "
               "Human Body Temp (37 °C), Boiling Water (100 °C), or Surface of the Sun (5778 K).")
    add_bullet("3. Step-by-Step Mathematical Explanation:", 
               "The application immediately renders the algebraic formula breakdown showing exact substitution and intermediate fractions.")
    add_bullet("4. Audio Acoustic Energy Synthesis:", 
               "Toggle the audio speaker icon to activate acoustic feedback. As temperature increases, the Web Audio oscillator "
               "smoothly shifts frequency upwards, providing an intuitive sensory representation of thermal kinetic energy.")
    add_bullet("5. Conversion History & Telemetry Export:", 
               "View the real-time conversion history table below the main card. Use the 'Export CSV' or 'Export JSON' buttons "
               "to stream and download historical records for laboratory analysis in Microsoft Excel, Python Pandas, or MATLAB.")

    add_heading_2("6.2 Administrator & DevOps Operational Manual")
    add_bullet("Prerequisites:", "Node.js v20.x or higher, npm v9.x or higher (or Docker v24+ / Docker Compose v2+).")
    add_bullet("Local Setup & Launch:", 
               "Clone repository -> Run 'npm install' -> Run 'npm test' (verifies 110 tests) -> Run 'npm start'. Access at http://localhost:3000.")
    add_bullet("Docker Production Launch:", 
               "Execute 'docker-compose up -d --build'. To inspect container health, run 'docker ps' or 'curl http://localhost:3000/api/health'.")
    add_bullet("Database Maintenance:", 
               "SQLite database is stored at 'server/data/conversions.db'. WAL mode generates temporary '-wal' and '-shm' files "
               "which are committed automatically on graceful shutdown (SIGINT/SIGTERM handlers implemented).")

    # =========================================================================
    # SECTION 7: FINAL PRESENTATION & VIVA VOCE DEFENSE GUIDE
    # =========================================================================
    add_heading_1("7. Final Project Presentation & Viva Voce Defense Guide")
    add_para(
        "This section outlines the 15-minute presentation demonstration structure and provides comprehensive, rigorous "
        "answers to anticipated technical questions from the faculty evaluation panel during the viva voce examination."
    )

    add_figure("diagrams/milestone5_presentation_flow.png", 
               "Figure 3: Final Presentation Architecture, Demonstration Workflow, and Viva Voce Defense Framework")

    add_heading_2("7.1 15-Minute Slide Deck Presentation Structure")
    add_bullet("Slide 1 — Title & Introduction (1 min):", 
               "Project overview, team members (Prakhar Harne & Naman Shrivastav), mentor acknowledgement, and project scope.")
    add_bullet("Slide 2 — Problem Statement & Industry Context (2 min):", 
               "IEEE-754 floating point precision drift, lack of Absolute Zero boundary enforcement in generic converters, and O(N²) code complexity.")
    add_bullet("Slide 3 — Architectural Design & 3-Tier Model (2 min):", 
               "Clean decoupling of SPA Client, Express API Layer, and SQLite WAL Persistence Layer. Walkthrough of the Kelvin Pivot pattern.")
    add_bullet("Slide 4 — Innovation Highlights (2 min):", 
               "Web Audio thermal synthesis, Canvas multi-scale ray gauge, step-by-step mathematical explanations, and physical state indicators.")
    add_bullet("Slide 5 — Production Containerization & Deployment (2 min):", 
               "Multi-stage Docker build (<95MB), Compose persistent named volume, non-root security isolation, PM2 clustering, and /api/health probes.")
    add_bullet("Slide 6 — Quality Assurance & Testing Audit (2 min):", 
               "110 automated tests (100% pass), 56 inverse symmetry checks, 100k ops stress benchmarks (4.16M ops/sec), and security fuzzing.")
    add_bullet("Slide 7 — Live System Demonstration (3 min):", 
               "Interactive UI conversion, preset selection, formula viewer, audio synthesis, WAL database persistence, and CSV export.")
    add_bullet("Slide 8 — Conclusion & Future Roadmap (1 min):", 
               "PWA offline ServiceWorker support, WebAssembly (WASM) calculation core, IoT telemetry bridge, and project wrap-up.")

    add_heading_2("7.2 Viva Voce Technical Defense Q&A Preparation")
    
    add_para(
        "Q1: Why did you route all 8 temperature scales through Kelvin instead of writing direct conversion formulas for each scale pair?",
        bold_prefix="Viva Question 1: ", keep_with_next=True
    )
    add_para(
        "Technical Defense: Writing direct paired formulas for 8 scales requires N × (N - 1) = 8 × 7 = 56 distinct mathematical functions. "
        "This creates massive code bloat, high risk of inconsistent constants, and difficult maintenance. By routing through Kelvin as the "
        "SI thermodynamic pivot, we only require N to-Kelvin functions and N from-Kelvin functions (2N = 16 functions). This reduces algorithmic "
        "complexity from O(N²) to O(N), guaranteeing uniform precision, centralizing Absolute Zero validation, and enabling instant addition of future scales."
    )

    add_para(
        "Q2: How does ThermaCraft prevent IEEE 754 floating-point precision drift during repetitive conversions?",
        bold_prefix="Viva Question 2: ", keep_with_next=True
    )
    add_para(
        "Technical Defense: In binary floating point, decimal fractions like 0.1 cannot be represented precisely, causing small round-off errors "
        "(e.g., 0.1 + 0.2 = 0.30000000000000004). ThermaCraft mitigates this via three layers: (1) Epsilon-based threshold clamping (Number.EPSILON), "
        "(2) Exact algebraic integer fraction ordering prior to floating division, and (3) Dynamic string formatting (ConversionService.formatPrecision) "
        "which uses high-precision decimal quantizers rather than unconstrained raw binary representations. This is proven by our 56 round-trip symmetry test vectors."
    )

    add_para(
        "Q3: Why was SQLite selected over NoSQL (e.g., MongoDB) or MySQL, and what is the importance of WAL mode?",
        bold_prefix="Viva Question 3: ", keep_with_next=True
    )
    add_para(
        "Technical Defense: SQLite is an embedded, serverless, zero-network-latency database engine that stores all data in a single ACID-compliant "
        "file, eliminating external database daemon crashes. Under default rollback journal mode, writing locks the entire database. By enabling "
        "Write-Ahead Logging (PRAGMA journal_mode = WAL), writes append sequentially to a separate -wal file, allowing concurrent readers to access "
        "the database without being blocked by active write operations. In our stress benchmarks, this allowed sustained throughput exceeding 4.1 million ops/sec."
    )

    add_para(
        "Q4: How does the system defend against SQL Injection and Cross-Site Scripting (XSS)?",
        bold_prefix="Viva Question 4: ", keep_with_next=True
    )
    add_para(
        "Technical Defense: For SQL Injection, all queries execute strictly via parameterized prepared statements (e.g., db.prepare('INSERT ... VALUES (?, ?, ?)')), "
        "ensuring SQL engines never evaluate user input as executable SQL tokens. For XSS, all text values rendered to the DOM use element.textContent rather "
        "than innerHTML, disallowing script execution. Our Tier 4 security test suite executes 20 aggressive fuzzing attacks (payloads containing OR 1=1, "
        "DROP TABLE, and <script>alert(1)</script>), confirming 100% neutralization."
    )

    # =========================================================================
    # SECTION 8: CONCLUSION & PROJECT SIGN-OFF
    # =========================================================================
    add_heading_1("8. Conclusion & Formal Project Sign-Off")
    add_para(
        "The ThermaCraft Temperature Conversion System has been successfully completed in accordance with all institutional "
        "specifications and guidelines established by Madhav Institute of Technology & Science, Gwalior (MITS-DU). The project "
        "demonstrates complete mastery of full-stack software engineering principles: requirements formalization, architectural design, "
        "precision mathematics, robust automated testing, containerized deployment, and exhaustive technical documentation."
    )

    # Authorship Sign-Off Table
    sign_table = doc.add_table(rows=3, cols=2)
    sign_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sign_table.autofit = False

    s_col_w = [Inches(3.2), Inches(3.2)]
    sign_data = [
        ["Lead Developer / Student Author:", "Project Co-Author:"],
        ["PRAKHAR HARNE\nEnrollment: BTCB26O1047\nDepartment of Computer Science & Technology (CST)\nMITS-DU, Gwalior",
         "NAMAN SHRIVASTAV\nEnrollment: BTCB26O1041\nDepartment of Computer Science & Technology (CST)\nMITS-DU, Gwalior"],
        ["Date of Submission: November 28, 2026\nStatus: Final Deliverable Submitted on SDMS",
         "Date of Submission: November 28, 2026\nStatus: Ready for Final Viva Voce Defense"]
    ]

    for r_idx, row in enumerate(sign_table.rows):
        for c_idx, cell in enumerate(row.cells):
            cell.width = s_col_w[c_idx]
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(3)
            run = p.add_run(sign_data[r_idx][c_idx])
            run.font.name = 'Calibri'
            run.font.size = Pt(9.5)
            if r_idx == 0:
                run.font.bold = True
                set_cell_background(cell, "F1F5F9")
            else:
                set_cell_background(cell, "FFFFFF")
            set_cell_margins(cell, top=70, bottom=70, left=100, right=100)

    keep_table_on_single_page(sign_table)

    # Save to file
    out_file = 'Temperature_Conversion_System_Milestone_5_Final_Report.docx'
    doc.save(out_file)
    print(f"Successfully generated {out_file} (Size: {os.path.getsize(out_file)} bytes)")

if __name__ == '__main__':
    create_milestone_5_report()
