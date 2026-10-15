import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

os.makedirs('diagrams', exist_ok=True)
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['font.size'] = 10

# -----------------------------------------------------------------
# 1. FULL-STACK 3-TIER ARCHITECTURE DIAGRAM (FRONTEND <-> BACKEND <-> DB)
# -----------------------------------------------------------------
fig, ax = plt.subplots(figsize=(11, 7.5), dpi=300)
ax.set_xlim(0, 11)
ax.set_ylim(0, 8.5)
ax.axis('off')

def draw_tier(x, y, w, h, title, subtitle, items, bg_color, border_color):
    box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.15", ec=border_color, fc=bg_color, lw=2.2)
    ax.add_patch(box)
    ax.text(x + 0.3, y + h - 0.45, title, fontsize=12, fontweight='bold', color="#0f172a")
    ax.text(x + 0.3, y + h - 0.75, subtitle, fontsize=9, color="#475569", style='italic')
    
    curr_y = y + h - 1.15
    for item in items:
        ax.text(x + 0.4, curr_y, item, fontsize=9, color="#1e293b", family='monospace')
        curr_y -= 0.35

# Tier 1: Client
draw_tier(0.6, 5.2, 9.8, 2.6,
          "CLIENT TIER: ThermaCraft Tactile Console Workstation",
          "Single-Page Laboratory Workstation • HTML5 / CSS3 / ES6+ JavaScript",
          ["• Transmutation Matrix & Continuous Scrubbing (0 K, Liquid N2, Body, Boil)",
           "• Dual-Scale Conversion Bridge (1°C = 1.8000°F Alignment Rulers & Target Pips)",
           "• Living Comfort Galvanometer (Spring Physics & Active Overdrive Flutter)",
           "• Everyday Matter & Substance Scanner (Cocoa, Tech, Water/Steam, Cooking)",
           "• Synthesized Web Audio API FX (Mechanical Relay & Rotary Clunks)"],
          "#eff6ff", "#2563eb")

# Tier 2: Backend
draw_tier(0.6, 2.7, 9.8, 2.0,
          "APPLICATION SERVER TIER: Express.js REST API",
          "Node.js Runtime • High-Precision Multi-Scale Business Logic",
          ["• REST Endpoints: /api/convert, /api/history, /api/stats, /api/export, /api/health",
           "• ConversionService: 8 Scales (Celsius, Fahrenheit, Kelvin, Rankine, Delisle, Newton, Réaumur, Rømer)",
           "• ValidationService: Strict Thermodynamic Lower Bound (Absolute Zero) Enforcement"],
          "#f0fdf4", "#16a34a")

# Tier 3: Database
draw_tier(0.6, 0.4, 9.8, 1.8,
          "PERSISTENCE TIER: Embedded Native SQLite 3 Database",
          "Node.js Native SQLite Engine • WAL Mode • Indexed Persistent Storage",
          ["• Schema: 'conversions' table (id, input_value, from_scale, result_value, to_scale, precision, formula, ...)",
           "• Performance: Write-Ahead Logging (WAL mode), Indexed Timestamp & Vector Queries",
           "• Analytics & Export: Aggregation Statistics, Direct CSV & JSON Data Streaming"],
          "#fef3c7", "#d97706")

# Bidirectional Communication Arrows
ax.annotate("", xy=(5.5, 5.2), xytext=(5.5, 4.7), arrowprops=dict(arrowstyle="<->", lw=2.5, color="#1e3a8a"))
ax.text(5.65, 4.95, "HTTP / JSON REST API", fontsize=9.5, fontweight='bold', color="#1e3a8a", va='center')

ax.annotate("", xy=(5.5, 2.7), xytext=(5.5, 2.2), arrowprops=dict(arrowstyle="<->", lw=2.5, color="#15803d"))
ax.text(5.65, 2.45, "Native Synchronous SQL & WAL Journaling", fontsize=9.5, fontweight='bold', color="#15803d", va='center')

plt.title("Figure 1: Full-Stack Integrated 3-Tier System Architecture (Milestone 3)", fontsize=13, fontweight='bold', pad=15, color="#0f172a")
plt.tight_layout()
plt.savefig('diagrams/milestone3_architecture.png', dpi=300)
plt.close()

# -----------------------------------------------------------------
# 2. DATABASE ENTITY-RELATIONSHIP (ER) & SCHEMA DIAGRAM
# -----------------------------------------------------------------
# Widen canvas and adjust column layout so ALL text stays safely inside boundaries
fig, ax = plt.subplots(figsize=(11.5, 7.5), dpi=300)
ax.set_xlim(0, 11.5)
ax.set_ylim(0, 7.5)
ax.axis('off')

# Table Box: x=0.6, y=1.0, w=10.3, h=5.6
box = patches.FancyBboxPatch((0.6, 1.0), 10.3, 5.6, boxstyle="round,pad=0.1", ec="#1e3a8a", fc="#f8fafc", lw=2.2)
ax.add_patch(box)

# Table Header: x=0.6, y=6.0, w=10.3, h=0.6
header_box = patches.Rectangle((0.6, 6.0), 10.3, 0.6, ec="#1e3a8a", fc="#1e3a8a", lw=2.2)
ax.add_patch(header_box)
ax.text(5.75, 6.3, "TABLE: conversions (SQLite 3 Database)", color="white", fontsize=12, fontweight='bold', ha='center', va='center')

columns = [
    ("id", "INTEGER", "PRIMARY KEY AUTOINCREMENT", "Unique conversion record identifier"),
    ("input_value", "REAL", "NOT NULL", "Source temperature numerical magnitude"),
    ("from_scale", "TEXT", "NOT NULL", "Source unit key (C, F, K, R, De, N, Re, Ro)"),
    ("result_value", "REAL", "NOT NULL", "Target temperature converted magnitude"),
    ("to_scale", "TEXT", "NOT NULL", "Target unit key"),
    ("precision_setting", "TEXT", "DEFAULT '4'", "Selected decimal rounding (2, 4, 6, 8, raw)"),
    ("formula", "TEXT", "NOT NULL", "Standardized mathematical derivation formula"),
    ("physical_state", "TEXT", "NULL", "Environmental thermal milestone (e.g. Boiling)"),
    ("client_ip", "TEXT", "NULL", "Client IP address for telemetry"),
    ("timestamp", "DATETIME", "DEFAULT CURRENT_TIMESTAMP", "UTC conversion execution timestamp")
]

curr_y = 5.65
for name, col_type, constraint, desc in columns:
    ax.text(0.9, curr_y, name, fontsize=9.5, fontweight='bold', family='monospace', color="#0f172a")
    ax.text(2.8, curr_y, col_type, fontsize=9, color="#2563eb", family='monospace')
    ax.text(4.0, curr_y, constraint, fontsize=8.5, color="#d97706", family='monospace')
    ax.text(6.8, curr_y, desc, fontsize=8.2, color="#475569", style='italic')
    ax.plot([0.7, 10.8], [curr_y - 0.09, curr_y - 0.09], color="#e2e8f0", lw=0.8)
    curr_y -= 0.43

# Indices Box: x=0.6, y=0.22, w=10.3, h=0.62
idx_box = patches.FancyBboxPatch((0.6, 0.22), 10.3, 0.62, boxstyle="round,pad=0.08", ec="#059669", fc="#ecfdf5", lw=1.8)
ax.add_patch(idx_box)
ax.text(5.75, 0.53, "INDICES: idx_conversions_timestamp (timestamp DESC) | idx_conversions_scales (from_scale, to_scale)",
        fontsize=8.5, fontweight='bold', color="#065f46", ha='center', va='center', family='monospace')

plt.title("Figure 2: SQLite Database Schema & Entity-Relationship Model", fontsize=13, fontweight='bold', pad=15, color="#0f172a")
plt.tight_layout()
plt.savefig('diagrams/db_schema_er.png', dpi=300)
plt.close()

print("Milestone 3 architecture and database ER diagrams generated successfully.")
