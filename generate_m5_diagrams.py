import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

os.makedirs('diagrams', exist_ok=True)
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['font.size'] = 10

# -----------------------------------------------------------------
# 1. FIGURE 1: PRODUCTION DEPLOYMENT & CONTAINERIZATION ARCHITECTURE
# -----------------------------------------------------------------
fig, ax = plt.subplots(figsize=(11.5, 7.8), dpi=300)
ax.set_xlim(0, 11.5)
ax.set_ylim(0, 8.5)
ax.axis('off')

# Header
ax.text(5.75, 8.1, "Figure 1: Production Multi-Tier Containerization & Cloud Deployment Architecture",
        fontsize=13, fontweight='bold', ha='center', color="#0f172a")

# Columns / Zones
# Zone 1: Client Layer (Left)
box_client = patches.FancyBboxPatch((0.5, 1.2), 2.8, 6.2, boxstyle="round,pad=0.15", ec="#3b82f6", fc="#eff6ff", lw=2)
ax.add_patch(box_client)
ax.text(1.9, 7.0, "CLIENT / EDGE TIER", fontsize=11, fontweight='bold', ha='center', color="#1e40af")

client_items = [
    ("Desktop & Mobile Browsers", "Chrome, Brave, Firefox, Safari"),
    ("Tactile Web UI (SPA)", "HTML5, CSS3 Tokens, Web Audio"),
    ("Dynamic Canvas Visualizer", "Multi-Scale Live Gauge Rays"),
    ("Local Persistence Cache", "localStorage Fallback Resilience"),
    ("Client-Side Formatter", "IEEE-754 Precision Rendering")
]
for i, (title, desc) in enumerate(client_items):
    y_pos = 5.8 - (i * 1.05)
    item_box = patches.FancyBboxPatch((0.7, y_pos), 2.4, 0.85, boxstyle="round,pad=0.08", ec="#93c5fd", fc="#ffffff", lw=1.2)
    ax.add_patch(item_box)
    ax.text(1.9, y_pos + 0.5, title, fontsize=9.2, fontweight='bold', ha='center', color="#0f172a")
    ax.text(1.9, y_pos + 0.18, desc, fontsize=7.8, ha='center', color="#64748b")

# Arrow Client -> Gateway
ax.annotate("", xy=(3.8, 4.3), xytext=(3.3, 4.3), arrowprops=dict(arrowstyle="->", color="#3b82f6", lw=2.5))
ax.text(3.55, 4.55, "HTTPS\nREST", fontsize=8, fontweight='bold', ha='center', color="#1e40af")

# Zone 2: Gateway & Container Runtime (Middle)
box_server = patches.FancyBboxPatch((3.8, 1.2), 4.4, 6.2, boxstyle="round,pad=0.15", ec="#8b5cf6", fc="#faf5ff", lw=2)
ax.add_patch(box_server)
ax.text(6.0, 7.0, "DOCKER RUNTIME (NODE 20 ALPINE)", fontsize=11, fontweight='bold', ha='center', color="#6b21a8")

server_items = [
    ("Nginx / Ingress Gateway", "SSL Termination • Rate Limiting • Gzip"),
    ("PM2 Process Manager", "Cluster Mode • Auto-Restart • Zero Downtime"),
    ("Express.js API Layer", "CORS • JSON Parser • Telemetry Middleware"),
    ("Scientific Services Engine", "ConversionCore • Validator • HistoryService"),
    ("Health Probe & Metrics", "/api/health • Memory & Uptime Telemetry")
]
for i, (title, desc) in enumerate(server_items):
    y_pos = 5.8 - (i * 1.05)
    item_box = patches.FancyBboxPatch((4.0, y_pos), 4.0, 0.85, boxstyle="round,pad=0.08", ec="#c084fc", fc="#ffffff", lw=1.2)
    ax.add_patch(item_box)
    ax.text(6.0, y_pos + 0.5, title, fontsize=9.2, fontweight='bold', ha='center', color="#0f172a")
    ax.text(6.0, y_pos + 0.18, desc, fontsize=7.8, ha='center', color="#64748b")

# Arrow Server -> Persistence
ax.annotate("", xy=(8.7, 4.3), xytext=(8.2, 4.3), arrowprops=dict(arrowstyle="->", color="#8b5cf6", lw=2.5))
ax.text(8.45, 4.55, "IPC / I/O\nWAL", fontsize=8, fontweight='bold', ha='center', color="#6b21a8")

# Zone 3: Persistence Layer (Right)
box_db = patches.FancyBboxPatch((8.7, 1.2), 2.4, 6.2, boxstyle="round,pad=0.15", ec="#10b981", fc="#ecfdf5", lw=2)
ax.add_patch(box_db)
ax.text(9.9, 7.0, "PERSISTENCE TIER", fontsize=11, fontweight='bold', ha='center', color="#065f46")

db_items = [
    ("Docker Volume", "Named Host Mount"),
    ("SQLite 3 Database", "ACID Compliance"),
    ("Write-Ahead Log", "WAL Concurrent IO"),
    ("conversions.db", "Indexed Storage"),
    ("CSV / JSON Export", "Streaming Data")
]
for i, (title, desc) in enumerate(db_items):
    y_pos = 5.8 - (i * 1.05)
    item_box = patches.FancyBboxPatch((8.9, y_pos), 2.0, 0.85, boxstyle="round,pad=0.08", ec="#6ee7b7", fc="#ffffff", lw=1.2)
    ax.add_patch(item_box)
    ax.text(9.9, y_pos + 0.5, title, fontsize=9.2, fontweight='bold', ha='center', color="#0f172a")
    ax.text(9.9, y_pos + 0.18, desc, fontsize=7.8, ha='center', color="#64748b")

# Footer metadata banner
foot_box = patches.FancyBboxPatch((0.5, 0.3), 10.6, 0.65, boxstyle="round,pad=0.08", ec="#cbd5e1", fc="#f8fafc", lw=1.2)
ax.add_patch(foot_box)
ax.text(5.75, 0.58, "Production Environment: Docker Compose v3.8 • Alpine Linux 3.19 • Zero-Downtime Cluster • Multi-Stage Build",
        fontsize=8.5, ha='center', color="#334155", fontweight='semibold')

plt.tight_layout()
plt.savefig('diagrams/milestone5_deployment_architecture.png', dpi=300)
plt.close()
print("Created diagrams/milestone5_deployment_architecture.png")


# -----------------------------------------------------------------
# 2. FIGURE 2: COMPLETE 5-MILESTONE LIFECYCLE & TRACEABILITY MATRIX
# -----------------------------------------------------------------
fig, ax = plt.subplots(figsize=(11.5, 7.8), dpi=300)
ax.set_xlim(0, 11.5)
ax.set_ylim(0, 8.5)
ax.axis('off')

ax.text(5.75, 8.1, "Figure 2: Complete Project Evolution & Lifecycle Traceability Matrix (Milestones 1–5)",
        fontsize=13, fontweight='bold', ha='center', color="#0f172a")

milestones = [
    ("M1: REQ ANALYSIS & ARCHITECTURE", "Evaluated: 6/8 Marks", 
     "Formal SRS • MVC Architecture • UML Diagrams (Use Case, Class, Sequence) • Traceability Matrix", 
     "#3b82f6", "#eff6ff", 6.8),
    ("M2: CORE CONVERSION & PROTOTYPE", "Evaluated: 5/8 Marks", 
     "Triple-Scale Core Engine (C, F, K) • IEEE-754 Precision Fixes • Absolute Zero Limits • 30 Unit Tests", 
     "#06b6d4", "#ecfeff", 5.4),
    ("M3: FULL-STACK 3-TIER SYSTEM", "Evaluated: 6/8 Marks", 
     "Express REST API • 8 Scales • SQLite WAL Mode • Web Audio Synthesis • CSV/JSON Export • 43 Tests", 
     "#8b5cf6", "#faf5ff", 4.0),
    ("M4: COMPREHENSIVE QA & BENCHMARKS", "Status: 100% Pass", 
     "110 Automated Tests • 56 Round-Trip Symmetries • 100k Ops Benchmarks • SQLi/XSS Fuzzing Matrix", 
     "#f59e0b", "#fffbeb", 2.6),
    ("M5: DEPLOYMENT & FINAL DEFENSE", "Status: Current Deliverable", 
     "Docker Multi-Stage • Compose Orchestration • Cloud CI/CD • User & Ops Manual • Viva Presentation", 
     "#10b981", "#ecfdf5", 1.2)
]

for title, tag, desc, border, bg, y_pos in milestones:
    card = patches.FancyBboxPatch((0.5, y_pos), 10.5, 1.15, boxstyle="round,pad=0.1", ec=border, fc=bg, lw=2)
    ax.add_patch(card)
    
    # Milestone pill
    pill = patches.FancyBboxPatch((0.7, y_pos + 0.65), 4.2, 0.38, boxstyle="round,pad=0.06", ec=border, fc=border, lw=1)
    ax.add_patch(pill)
    ax.text(2.8, y_pos + 0.74, title, fontsize=9.2, fontweight='bold', ha='center', color="#ffffff")
    
    # Evaluation tag
    tag_box = patches.FancyBboxPatch((5.1, y_pos + 0.65), 2.2, 0.38, boxstyle="round,pad=0.06", ec=border, fc="#ffffff", lw=1.2)
    ax.add_patch(tag_box)
    ax.text(6.2, y_pos + 0.74, tag, fontsize=8.5, fontweight='bold', ha='center', color=border)
    
    # Description
    ax.text(0.8, y_pos + 0.28, desc, fontsize=8.8, color="#1e293b")
    
    # Connecting arrows between milestones
    if y_pos > 1.2:
        ax.annotate("", xy=(5.75, y_pos - 0.05), xytext=(5.75, y_pos - 0.2),
                    arrowprops=dict(arrowstyle="->", color="#94a3b8", lw=2))

# Bottom footer
ax.text(5.75, 0.45, "Total QA Corpus: 110 Verified Tests (100% Pass) | Architecture: 3-Tier Enterprise | Persistence: SQLite3 WAL",
        fontsize=8.5, ha='center', color="#475569", style='italic')

plt.tight_layout()
plt.savefig('diagrams/milestone5_project_evolution_lifecycle.png', dpi=300)
plt.close()
print("Created diagrams/milestone5_project_evolution_lifecycle.png")


# -----------------------------------------------------------------
# 3. FIGURE 3: FINAL PRESENTATION & VIVA VOCE DEFENSE FLOW
# -----------------------------------------------------------------
fig, ax = plt.subplots(figsize=(11.5, 7.5), dpi=300)
ax.set_xlim(0, 11.5)
ax.set_ylim(0, 8.5)
ax.axis('off')

ax.text(5.75, 8.1, "Figure 3: Final Project Presentation & Viva Voce Demonstration Flow",
        fontsize=13, fontweight='bold', ha='center', color="#0f172a")

stages = [
    (0.6, 5.0, 3.2, 2.5, "1. PROBLEM & CONTEXT", 
     "• Floating-point IEEE-754 drift\n• Sub-absolute zero impossibilities\n• Clunky educational interfaces\n• Lack of multi-scale context",
     "#3b82f6", "#eff6ff"),
    (4.15, 5.0, 3.2, 2.5, "2. ARCHITECTURAL SOLUTION", 
     "• Canonical Kelvin abstraction\n• 3-Tier decoupled MVC architecture\n• High-throughput SQLite3 WAL mode\n• Multi-scale radar telemetry",
     "#8b5cf6", "#faf5ff"),
    (7.7, 5.0, 3.2, 2.5, "3. INNOVATIVE HIGHLIGHTS", 
     "• Web Audio frequency feedback\n• Interactive Canvas temperature ray\n• Step-by-step formula breakdown\n• Real-time thermal classification",
     "#ec4899", "#fdf2f8"),
    (0.6, 1.6, 3.2, 2.5, "4. RIGOROUS QA & BENCHMARKS", 
     "• 110 automated tests (100% pass)\n• 56 round-trip symmetry vectors\n• 100k ops stress benchmarks\n• SQLi & XSS security fuzzing",
     "#f59e0b", "#fffbeb"),
    (4.15, 1.6, 3.2, 2.5, "5. CONTAINER & DEPLOYMENT", 
     "• Production Docker multi-stage\n• docker-compose named volumes\n• PM2 cluster zero downtime\n• /api/health automated probes",
     "#10b981", "#ecfdf5"),
    (7.7, 1.6, 3.2, 2.5, "6. VIVA DEFENSE PREPARATION", 
     "• Mathematical derivation defense\n• ACID WAL concurrency proofs\n• Absolute zero physical boundary\n• Future PWA & IoT telemetry roadmap",
     "#06b6d4", "#ecfeff")
]

for x, y, w, h, title, body, border, bg in stages:
    box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.12", ec=border, fc=bg, lw=2)
    ax.add_patch(box)
    
    header = patches.FancyBboxPatch((x + 0.1, y + h - 0.55), w - 0.2, 0.45, boxstyle="round,pad=0.06", ec=border, fc=border, lw=1)
    ax.add_patch(header)
    ax.text(x + w / 2, y + h - 0.32, title, fontsize=9.2, fontweight='bold', ha='center', color="#ffffff")
    
    ax.text(x + 0.25, y + h - 0.85, body, fontsize=8.2, color="#1e293b", va='top')

# Horizontal Flow Arrows (Top row)
ax.annotate("", xy=(4.05, 6.25), xytext=(3.85, 6.25), arrowprops=dict(arrowstyle="->", color="#64748b", lw=2.5))
ax.annotate("", xy=(7.6, 6.25), xytext=(7.4, 6.25), arrowprops=dict(arrowstyle="->", color="#64748b", lw=2.5))

# Flow from Top to Bottom
ax.annotate("", xy=(9.3, 4.2), xytext=(9.3, 4.95), arrowprops=dict(arrowstyle="->", color="#64748b", lw=2.5))
ax.annotate("", xy=(5.75, 4.2), xytext=(5.75, 4.95), arrowprops=dict(arrowstyle="->", color="#64748b", lw=2.5))

# Horizontal Flow Arrows (Bottom row)
ax.annotate("", xy=(4.05, 2.85), xytext=(3.85, 2.85), arrowprops=dict(arrowstyle="->", color="#64748b", lw=2.5))
ax.annotate("", xy=(7.6, 2.85), xytext=(7.4, 2.85), arrowprops=dict(arrowstyle="->", color="#64748b", lw=2.5))

# Footer
foot_box = patches.FancyBboxPatch((0.6, 0.4), 10.3, 0.65, boxstyle="round,pad=0.08", ec="#cbd5e1", fc="#f8fafc", lw=1.2)
ax.add_patch(foot_box)
ax.text(5.75, 0.68, "Presentation Format: 15-Minute Demonstration + 5-Minute Technical Viva Voce Defense",
        fontsize=8.8, ha='center', color="#334155", fontweight='semibold')

plt.tight_layout()
plt.savefig('diagrams/milestone5_presentation_flow.png', dpi=300)
plt.close()
print("Created diagrams/milestone5_presentation_flow.png")
