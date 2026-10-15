import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
import os

def create_report():
    doc = docx.Document()

    # 1-inch margins all around (Standard Academic & Corporate Specifications)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Styling helper
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
        3. keep_with_next on all paragraphs of all rows except the last row:
           glues all rows of the table together so Word will never break the table
           across page boundaries.
        """
        for r_idx, row in enumerate(table.rows):
            trPr = row._tr.get_or_add_trPr()
            trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
            if r_idx == 0:
                trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))
            
            # Glue all rows together (except the last row)
            if r_idx < len(table.rows) - 1:
                for cell in row.cells:
                    for p in cell.paragraphs:
                        p.paragraph_format.keep_with_next = True

    def add_heading_1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(16)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)
        return p

    def add_heading_2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(13)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x25, 0x63, 0xEB)
        return p

    def add_para(text, bold_prefix=None, space_after=6, keep_with_next=False):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.15
        if keep_with_next:
            p.paragraph_format.keep_with_next = True
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.bold = True
            r_pre.font.color.rgb = RGBColor(0x11, 0x18, 0x27)
        r = p.add_run(text)
        r.font.color.rgb = RGBColor(0x37, 0x41, 0x51)
        return p

    def add_bullet(text, bold_prefix=None):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.bold = True
            r_pre.font.color.rgb = RGBColor(0x11, 0x18, 0x27)
        r = p.add_run(text)
        r.font.color.rgb = RGBColor(0x37, 0x41, 0x51)
        return p

    def add_callout(title, text, color_hex="EFF6FF", border_color="2563EB"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        set_cell_background(cell, color_hex)
        set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
        
        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'<w:left w:val="single" w:sz="24" w:space="0" w:color="{border_color}"/>'
            f'<w:top w:val="none"/><w:right w:val="none"/><w:bottom w:val="none"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)
        
        trPr = tbl.rows[0]._tr.get_or_add_trPr()
        trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
        
        cp = cell.paragraphs[0]
        cp.paragraph_format.space_after = Pt(2)
        r1 = cp.add_run(f"⚡ {title}: ")
        r1.font.bold = True
        r1.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)
        r2 = cp.add_run(text)
        r2.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)
        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    def add_image_figure(img_path, caption, width=Inches(6.2)):
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(8)
            p_img.paragraph_format.space_after = Pt(4)
            p_img.paragraph_format.keep_with_next = True
            doc.add_picture(img_path, width=width)
            
            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_after = Pt(12)
            r_cap = p_cap.add_run(caption)
            r_cap.font.size = Pt(9.5)
            r_cap.font.italic = True
            r_cap.font.color.rgb = RGBColor(0x4B, 0x55, 0x63)

    # =========================================================
    # DOCUMENT COVER / TITLE (PAGE 1)
    # =========================================================
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(16)
    p_title.paragraph_format.space_after = Pt(2)
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p_title.add_run("THERMACRAFT • TEMPERATURE CONVERSION SYSTEM")
    r.font.name = 'Calibri'
    r.font.size = Pt(22)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_after = Pt(12)
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_sub.add_run("Milestone 3: Implementation, Development & Tactile Studio Delivery")
    r_sub.font.size = Pt(13)
    r_sub.font.bold = True
    r_sub.font.color.rgb = RGBColor(0x25, 0x63, 0xEB)

    # Metadata Table (Kept together on 1 page)
    meta_table = doc.add_table(rows=9, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_widths = [Inches(2.2), Inches(4.3)]
    meta_data = [
        ("Project Title:", "ThermaCraft • High-Precision Multi-Scale Workstation"),
        ("Milestone Phase:", "Milestone 3: Implementation / Development"),
        ("Milestone Objective:", "Convert architectural design into a working, integrated, human-relatable software system"),
        ("Authors / Engineers:", "Prakhar Harne and Naman Shrivastav"),
        ("Full-Stack Architecture:", "3-Tier (Client Workstation + Express.js REST API + SQLite 3 DB + GitHub Pages Standalone)"),
        ("Version Control Repository:", "https://github.com/B1tBr34k3r/temperature-conversion-system"),
        ("Live Public Web Application:", "https://b1tbr34k3r.github.io/temperature-conversion-system/"),
        ("Current System Version:", "Version 3.2 (ThermaCraft Studio Release)"),
        ("Date of Evaluation:", "October 2026")
    ]
    for idx, (label, val) in enumerate(meta_data):
        row = meta_table.rows[idx]
        cell_lbl, cell_val = row.cells[0], row.cells[1]
        cell_lbl.width = meta_widths[0]
        cell_val.width = meta_widths[1]
        set_cell_background(cell_lbl, "F1F5F9")
        set_cell_background(cell_val, "F8FAFC")
        set_cell_margins(cell_lbl, 50, 50, 90, 90)
        set_cell_margins(cell_val, 50, 50, 90, 90)
        
        p0 = cell_lbl.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(label)
        r0.font.bold = True
        r0.font.size = Pt(9.5)
        r0.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
        
        p1 = cell_val.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(val)
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    keep_table_on_single_page(meta_table)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # Milestone 3 Objective Callout
    add_callout(
        "Milestone 3 Core Deliverables Fulfillment",
        "Milestone 3 successfully converts architectural specifications into an operational, production-grade software system satisfying all four prescribed deliverables: (1) Modular Source Code (client, server, services, config); (2) Front-End and Back-End Integration via RESTful API; (3) SQLite Database Implementation with WAL persistence; and (4) Version Control Repository synchronized with GitHub and deployed live to GitHub Pages."
    )

    # Page Break after Cover
    doc.add_page_break()

    # =========================================================
    # 1. EXECUTIVE SUMMARY & ARCHITECTURAL EVOLUTION (PAGE 2)
    # =========================================================
    add_heading_1("1. Executive Summary & Full-Stack Evolution")
    add_para(
        "Milestone 3 marks the definitive transition of the Temperature Conversion System from an architectural prototype into a fully integrated, modular, multi-tier software system christened ThermaCraft. While Milestone 1 formulated requirements and Milestone 2 verified standalone mathematical conversion logic, Milestone 3 delivers a complete client-server-database ecosystem with high-performance RESTful communication, embedded relational database persistence, and an artisanal tactile bench workstation designed for human relatability."
    )
    add_para(
        "Key engineering breakthroughs achieved in Milestone 3 include:"
    )
    add_bullet(" Expanded the core scientific conversion engine from the initial 3 scales to 8 thermodynamic scales: Celsius (°C), Fahrenheit (°F), Kelvin (K), Rankine (°R), Delisle (°De), Newton (°N), Réaumur (°Ré), and Rømer (°Rø).", "1. Multi-Scale Scientific Matrix:")
    add_bullet(" Engineered an Express.js application server decoupling mathematical transformations, input validation, and database queries into dedicated, reusable service modules with zero fragile native dependencies.", "2. Modular RESTful Backend:")
    add_bullet(" Implemented native SQLite 3 database persistence using Write-Ahead Logging (WAL mode), indexing, and complete CRUD functionality, including analytical telemetry and CSV/JSON data streaming.", "3. Relational Database Layer:")
    add_bullet(" Created the ThermaCraft tactile workstation featuring a Dual-Scale Conversion Bridge, Everyday Matter & Substance Scanner, Living Comfort Galvanometer with Absurd Overdrive Mode, Dynamic Extreme Living Benchmarks, and synthesized Web Audio mechanical sound design.", "4. Tactile Human-Centric Interface:")
    add_bullet(" Automated verification with 43 passing unit and integration tests covering all 8 scales, thermodynamic bounds, database transactions, and API endpoints with 100% test success.", "5. Comprehensive Test Automation:")
    add_bullet(" Dual deployment architecture enabling full-stack local server execution and 100% zero-dependency in-browser client execution deployed globally on GitHub Pages.", "6. Dual-Mode Deployment:")

    # =========================================================
    # 2. SYSTEM ARCHITECTURE & 3-TIER INTEGRATION
    # =========================================================
    add_heading_1("2. Full-Stack System Architecture & Module Integration")
    add_para(
        "The software architecture follows a strict 3-tier enterprise pattern ensuring separation of concerns, high throughput, and fault tolerance. Figure 1 illustrates the interaction flow between the Presentation, Application, and Persistence tiers."
    )
    add_image_figure('diagrams/milestone3_architecture.png', "Figure 1: Full-Stack Integrated 3-Tier System Architecture (Milestone 3)", width=Inches(5.8))

    # Page Break so Codebase Structure Table begins cleanly on a single page
    doc.add_page_break()

    add_heading_2("2.1 Module-Wise Source Code Organization")
    add_para(
        "The codebase is decomposed into cohesive, isolated modules reflecting modern software engineering principles. Table 1 details each core module and its architectural responsibility:",
        keep_with_next=True
    )
    
    # Codebase Structure Table (Kept together on 1 single page)
    code_tbl = doc.add_table(rows=9, cols=3)
    code_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    code_widths = [Inches(2.2), Inches(1.5), Inches(2.8)]
    c_headers = ["Module / File", "Component Role", "Primary Responsibilities"]
    c_rows = [
        ("server/server.js", "Server Entry Point", "Configures Express, CORS, static asset streaming, and API routing"),
        ("server/config/db.js", "Persistence Layer", "Native SQLite 3 connection, schema migration, WAL pragma, and CRUD methods"),
        ("server/services/conversionService.js", "Scientific Engine", "8-scale conversion algorithms, IEEE 754 epsilon formatting, formula generator"),
        ("server/services/validationService.js", "Validation Layer", "Thermodynamic lower bound (Absolute Zero) checks, regex syntax, finiteness"),
        ("server/routes/api.js", "REST Controller", "HTTP endpoints: /convert, /history, /stats, /export/csv, /export/json, /health"),
        ("client/js/gauge.js", "Galvanometer Engine", "Damped spring-physics comfort tachometer with active overdrive needle flutter"),
        ("client/js/thermalContext.js", "Matter Scanner", "Simulates substance state transitions (Cocoa, Tech, Steam, Cooking) & curiosities"),
        ("client/js/audio.js", "Audio Synthesizer", "Synthesizes mechanical relay clicks and rotary switch clunks via Web Audio API")
    ]
    for c_idx, h_text in enumerate(c_headers):
        cell = code_tbl.rows[0].cells[c_idx]
        cell.width = code_widths[c_idx]
        set_cell_background(cell, "1E3A8A")
        set_cell_margins(cell, 60, 60, 80, 80)
        p = cell.paragraphs[0]
        r = p.add_run(h_text)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        r.font.size = Pt(9.5)

    for r_idx, (col0, col1, col2) in enumerate(c_rows):
        row = code_tbl.rows[r_idx + 1]
        bg = "F8FAFC" if r_idx % 2 == 0 else "FFFFFF"
        for c_idx, text in enumerate([col0, col1, col2]):
            cell = row.cells[c_idx]
            cell.width = code_widths[c_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, 45, 45, 75, 75)
            p = cell.paragraphs[0]
            r = p.add_run(text)
            r.font.size = Pt(8.5)
            if c_idx == 0:
                r.font.name = 'Consolas'
                r.font.bold = True
                r.font.color.rgb = RGBColor(0x1E, 0x40, 0xAF)

    keep_table_on_single_page(code_tbl)
    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # Page Break before Database Section
    doc.add_page_break()

    # =========================================================
    # 3. DATABASE IMPLEMENTATION & SCHEMA DESIGN
    # =========================================================
    add_heading_1("3. Database Implementation & Relational Persistence")
    add_para(
        "To fulfill the database deliverable of Milestone 3, the system integrates an embedded SQLite 3 database utilizing Node.js's native SQLite engine (node:sqlite). This eliminates fragile third-party binary C++ compilation dependencies while delivering high-speed ACID-compliant relational persistence directly on disk."
    )
    
    add_heading_2("3.1 Relational Schema & Entity-Relationship Model")
    add_para(
        "All conversion telemetry, timestamps, input parameters, converted outputs, mathematical formulas, and environmental milestones are stored in the conversions table, as illustrated in Figure 2."
    )
    add_image_figure('diagrams/db_schema_er.png', "Figure 2: SQLite Database Schema & Entity-Relationship Architecture", width=Inches(6.0))

    add_heading_2("3.2 Performance Optimization & WAL Mode")
    add_para(
        "The database connection executes with Write-Ahead Logging enabled (PRAGMA journal_mode = WAL). Under WAL mode, read operations do not block write operations and write operations do not block read operations, ensuring near-instantaneous query response times under high concurrency."
    )
    add_bullet(" An index on timestamp DESC optimizes recent history queries (/api/history) and analytical aggregation.", "Temporal Indexing (idx_conversions_timestamp):")
    add_bullet(" A compound index on (from_scale, to_scale) accelerates vector analytics and popular scale computation.", "Scale Vector Indexing (idx_conversions_scales):")

    # Page Break before REST API Section
    doc.add_page_break()

    # =========================================================
    # 4. RESTFUL API SPECIFICATION & INTEGRATION
    # =========================================================
    add_heading_1("4. RESTful API Specification & Integration Layer")
    add_para(
        "The frontend communicates with the backend asynchronously through JSON-encoded HTTP REST requests. Table 2 details the complete RESTful endpoint specification:",
        keep_with_next=True
    )

    # API Table (Kept together on 1 single page)
    api_tbl = doc.add_table(rows=7, cols=4)
    api_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    api_widths = [Inches(0.9), Inches(1.3), Inches(1.7), Inches(2.6)]
    a_headers = ["HTTP Method", "Endpoint", "Payload / Query", "Response Payload Description"]
    a_rows = [
        ("POST", "/api/convert", "{ value, fromScale, toScale, precision }", "Returns converted value, derivation steps, thermal tier, and 8-scale radar"),
        ("GET", "/api/history", "?limit=50&offset=0", "Retrieves timestamped conversion logs from SQLite database"),
        ("DELETE", "/api/history", "None", "Purges database conversion records and reclaims storage via VACUUM"),
        ("GET", "/api/stats", "None", "Returns total conversions count, most frequent scales, and recorded extremes"),
        ("GET", "/api/export/csv", "None", "Streams conversion history as a downloadable CSV spreadsheet file"),
        ("GET", "/api/health", "None", "Diagnostic telemetry: uptime, DB status, supported scale count, and status")
    ]
    for c_idx, h_text in enumerate(a_headers):
        cell = api_tbl.rows[0].cells[c_idx]
        cell.width = api_widths[c_idx]
        set_cell_background(cell, "1E3A8A")
        set_cell_margins(cell, 60, 60, 75, 75)
        p = cell.paragraphs[0]
        r = p.add_run(h_text)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        r.font.size = Pt(9)

    for r_idx, (col0, col1, col2, col3) in enumerate(a_rows):
        row = api_tbl.rows[r_idx + 1]
        bg = "F8FAFC" if r_idx % 2 == 0 else "FFFFFF"
        for c_idx, text in enumerate([col0, col1, col2, col3]):
            cell = row.cells[c_idx]
            cell.width = api_widths[c_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, 45, 45, 65, 65)
            p = cell.paragraphs[0]
            r = p.add_run(text)
            r.font.size = Pt(8.5)
            if c_idx in (0, 1):
                r.font.name = 'Consolas'
                r.font.bold = True

    keep_table_on_single_page(api_tbl)
    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # Page Break before Workstation Showcase Section
    doc.add_page_break()

    # =========================================================
    # 5. THERMACRAFT TACTILE WORKSTATION & USER EXPERIENCE
    # =========================================================
    add_heading_1("5. ThermaCraft Tactile Workstation & Human-Centric UI Showcase")
    add_para(
        "To elevate the user experience beyond conventional static academic wireframes and obscure scientific meters, Milestone 3 delivers the ThermaCraft Workstation. Designed with an artisanal milled metal and luminescent phosphor aesthetic, it connects abstract thermodynamic numbers to relatable real-world experiences."
    )
    add_image_figure('diagrams/github_pages_live.png', "Figure 3: Live ThermaCraft Tactile Workstation in Active Operation (100°C Converted to 212°F)", width=Inches(5.8))

    add_heading_2("5.1 Core Interactive Workstation Components")
    add_bullet(" A synchronized side-by-side visual ruler that graphically maps input magnitude to the target scale with live animated pips, exact scale ratio multipliers (1°C = 1.8000°F), and baseline shift chips (+32°F).", "1. Dual-Scale Conversion Bridge:")
    add_bullet(" A real-time physical simulation tracking how everyday substances transform at the exact converted temperature across four domains: Cocoa & Butter, Smartphone Tech & Battery safety limits, Water & Steam Dynamics (1,600× volume expansion), and Culinary Chemistry.", "2. Everyday Matter & Substance Scanner:")
    add_bullet(" A spring-physics analog needle dynamically sweeping across Freezing (<0°C), Comfort Living (15–26°C), Summer Heat (27–50°C), and Scalding/Cooking (50–220°C). When extreme temperatures (>220°C or <-50°C) are entered, it engages Active Overdrive Mode with dynamic needle flutter jitter, in-dial warning callouts, and boiling energy multipliers.", "3. Living Comfort Gauge with Overdrive Flutter:")
    add_bullet(" Provides 8 clickable presets for real-world scenarios plus an 8th dynamic extreme slot that automatically computes real-world equivalents for absurd inputs: from Liquid Nitrogen (-196°C) and Absolute Zero (-273.15°C), to Basalt Lava (1,000°C), Molten Steel (1,538°C), Tungsten Filament (3,422°C), Solar Surface (5,505°C), Lightning (30,000°C), and Stellar Fusion (15,000,000°C).", "4. 8 Dynamic Everyday Benchmarks & Extreme Slot:")
    add_bullet(" Highlights the Big Three global scales (Celsius, Fahrenheit, Kelvin) with an expandable drawer exploring 5 historical antique scales (Rankine, Delisle, Newton, Réaumur, Rømer) with concise historical notes.", "5. Primary Essentials & Antique Scales Drawer:")
    add_bullet(" Synthesizes tactile mechanical relay clicks, rotary switch clunks, and analog hums dynamically using the Web Audio API without requiring any external audio assets.", "6. Synthesized Mechanical Sound Design:")

    add_image_figure('diagrams/sdms_thumbnail.png', "Figure 4: ThermaCraft High-Resolution Architectural Console Showcase Poster", width=Inches(5.8))

    # Page Break before Verification Section
    doc.add_page_break()

    # =========================================================
    # 6. QUALITY ASSURANCE & AUTOMATED VERIFICATION
    # =========================================================
    add_heading_1("6. Automated Verification & Quality Assurance Suite")
    add_para(
        "A rigorous automated test suite was constructed in tests/backend.test.js covering all layers of the software system. Table 3 presents the verification breakdown where all 43 assertions passed with 100% success:",
        keep_with_next=True
    )

    # Test Results Table (Kept together on 1 single page)
    test_tbl = doc.add_table(rows=7, cols=4)
    test_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    test_widths = [Inches(1.8), Inches(1.8), Inches(1.5), Inches(1.4)]
    t_headers = ["Test Suite Category", "Scope / Condition Tested", "Validation Metric", "Status"]
    t_rows = [
        ("Multi-Scale Mathematical Accuracy", "All 8 scales (C, F, K, R, De, N, Re, Ro) benchmarks", "Numerical tolerance <= 1e-4", "PASSED (16/16)"),
        ("Thermodynamic Limit Enforcement", "Absolute Zero lower bounds across all scales", "Strict rejection of sub-zero", "PASSED (6/6)"),
        ("Syntactic Input Sanitization", "Empty strings, whitespace, non-numeric strings, NaN", "Validation error returned", "PASSED (6/6)"),
        ("SQLite Database Operations", "Insertions, queries, chronological ordering, VACUUM", "Zero data corruption", "PASSED (6/6)"),
        ("Analytical Telemetry Engine", "Aggregation statistics, min/max inputs calculation", "Exact statistical match", "PASSED (3/3)"),
        ("Multi-Scale Radar & Thermal Tiers", "8-scale simultaneous projection & tier detection", "Accurate thermal labeling", "PASSED (6/6)")
    ]
    for c_idx, h_text in enumerate(t_headers):
        cell = test_tbl.rows[0].cells[c_idx]
        cell.width = test_widths[c_idx]
        set_cell_background(cell, "1E3A8A")
        set_cell_margins(cell, 60, 60, 75, 75)
        p = cell.paragraphs[0]
        r = p.add_run(h_text)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        r.font.size = Pt(9)

    for r_idx, (col0, col1, col2, col3) in enumerate(t_rows):
        row = test_tbl.rows[r_idx + 1]
        bg = "F8FAFC" if r_idx % 2 == 0 else "FFFFFF"
        for c_idx, text in enumerate([col0, col1, col2, col3]):
            cell = row.cells[c_idx]
            cell.width = test_widths[c_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, 45, 45, 75, 75)
            p = cell.paragraphs[0]
            r = p.add_run(text)
            r.font.size = Pt(8.5)
            if c_idx == 3:
                r.font.bold = True
                r.font.color.rgb = RGBColor(0x15, 0x80, 0x3D)

    keep_table_on_single_page(test_tbl)
    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # =========================================================
    # 7. VERSION CONTROL & GITHUB REPOSITORY
    # =========================================================
    add_heading_1("7. Version Control & Repository Synchronization")
    add_para(
        "In strict compliance with the version control deliverable, all source code, database modules, assets, test suites, and documentation are tracked under Git version control and pushed to the public remote repository:"
    )
    add_para(
        "https://github.com/B1tBr34k3r/temperature-conversion-system",
        bold_prefix="Official GitHub Repository: "
    )
    add_para(
        "https://b1tbr34k3r.github.io/temperature-conversion-system/",
        bold_prefix="Live Public GitHub Pages: "
    )
    add_para(
        "The repository includes comprehensive commit histories, an updated README with architecture diagrams, automated test scripts, and complete instructions for executing both the backend server and frontend workstation."
    )

    # =========================================================
    # 8. CONCLUSION & ROADMAP FOR MILESTONE 4
    # =========================================================
    add_heading_1("8. Conclusion & Roadmap for Milestone 4")
    add_para(
        "Milestone 3 has successfully converted the initial system design into a working, high-performance software system. The integration between the ThermaCraft client workstation, the modular Express REST API, and the embedded SQLite database operates with total stability and zero defects."
    )
    add_para(
        "Planned extensions for Milestone 4 (Comprehensive Testing & Optimization) include:"
    )
    add_bullet(" Stress testing under synthetic concurrent loads to establish maximum throughput limits.", "1. Load & Concurrency Stress Testing:")
    add_bullet(" Integration of Chart.js / D3 interactive canvas graphs to render historical temperature trends dynamically.", "2. Historical Trend Graph Visualization:")
    add_bullet(" Packaging the application with Service Workers for offline Progressive Web App (PWA) operation.", "3. PWA Offline Service Worker:")

    # Save
    out_file = "Temperature_Conversion_System_Milestone_3_Report.docx"
    doc.save(out_file)
    print(f"Report document successfully generated: {out_file}")

if __name__ == "__main__":
    create_report()
