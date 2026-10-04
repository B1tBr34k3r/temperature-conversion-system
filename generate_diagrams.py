import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

os.makedirs('diagrams', exist_ok=True)

# Set common high-DPI styling
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['font.size'] = 10

# -------------------------------------------------------------
# 1. USE CASE DIAGRAM
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 7)
ax.axis('off')

# System Boundary Box
sys_box = patches.FancyBboxPatch((3.0, 0.4), 6.5, 6.2, boxstyle="round,pad=0.1", ec="#1E3A8A", fc="#F8FAFC", lw=2)
ax.add_patch(sys_box)
ax.text(6.25, 6.35, "System Boundary: Temperature Conversion Web App", fontsize=12, fontweight='bold', ha='center', color="#1E3A8A")

# Actor (User)
ax.plot([1.2, 1.2], [4.2, 3.4], color="#1E293B", lw=2.5) # spine
head = patches.Circle((1.2, 4.6), 0.35, ec="#1E293B", fc="#E2E8F0", lw=2.5)
ax.add_patch(head)
ax.plot([0.7, 1.7], [3.9, 3.9], color="#1E293B", lw=2.5) # arms
ax.plot([1.2, 0.7], [3.4, 2.5], color="#1E293B", lw=2.5) # left leg
ax.plot([1.2, 1.7], [3.4, 2.5], color="#1E293B", lw=2.5) # right leg
ax.text(1.2, 2.1, "User / Student", fontsize=11, fontweight='bold', ha='center', color="#0F172A")

# Use Cases (Ovals)
use_cases = [
    (6.25, 5.5, "Input Temperature Value & Select Scales\n(UC-01)", "#DBEAFE", "#2563EB"),
    (6.25, 4.3, "Validate Input & Physical Boundaries\n(UC-02 - Absolute Zero)", "#FEF3C7", "#D97706"),
    (6.25, 3.1, "Compute Conversion with High Precision\n(UC-03 - IEEE 754 Math)", "#DCFCE7", "#16A34A"),
    (6.25, 1.9, "View Formula & Physical State\n(UC-04 - Explanations)", "#F3E8FF", "#9333EA"),
    (6.25, 0.8, "Persist & Review Conversion History\n(UC-05 - LocalStorage Fallback)", "#FCE7F3", "#DB2777")
]

for x, y, text, fc, ec in use_cases:
    ellipse = patches.Ellipse((x, y), 5.4, 0.85, ec=ec, fc=fc, lw=1.8)
    ax.add_patch(ellipse)
    ax.text(x, y, text, fontsize=9.5, ha='center', va='center', fontweight='medium', color="#1E293B")
    # Connection line from user
    ax.annotate("", xy=(x - 2.5, y), xytext=(1.7, 3.9),
                arrowprops=dict(arrowstyle="->", color="#475569", lw=1.2))

# Include relationship between UC-01 and UC-02
ax.annotate("<<includes>>", xy=(7.2, 4.75), xytext=(7.2, 5.05),
            fontsize=8, ha='center', color="#475569", style='italic')

plt.title("Figure 1: Use Case Diagram for Temperature Conversion System", fontsize=13, fontweight='bold', pad=15, color="#0F172A")
plt.tight_layout()
plt.savefig('diagrams/use_case_diagram.png', dpi=300)
plt.close()

# -------------------------------------------------------------
# 2. CLASS DIAGRAM
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(11, 7.5), dpi=300)
ax.set_xlim(0, 11)
ax.set_ylim(0, 8.5)
ax.axis('off')

def draw_class(x, y, w, h, title, attributes, methods, color_header="#1E40AF", color_bg="#F8FAFC"):
    # Outer box
    box = patches.Rectangle((x, y), w, h, ec=color_header, fc=color_bg, lw=1.8)
    ax.add_patch(box)
    
    # Title box
    th = 0.65
    title_box = patches.Rectangle((x, y + h - th), w, th, ec=color_header, fc=color_header, lw=1.8)
    ax.add_patch(title_box)
    ax.text(x + w/2, y + h - th/2, title, color="white", fontsize=10.5, fontweight='bold', ha='center', va='center')
    
    # Attributes
    curr_y = y + h - th - 0.25
    for attr in attributes:
        ax.text(x + 0.15, curr_y, attr, fontsize=8.5, color="#0F172A", family='monospace')
        curr_y -= 0.28
        
    # Divider
    div_y = y + len(methods) * 0.28 + 0.3
    ax.plot([x, x + w], [div_y, div_y], color=color_header, lw=1)
    
    # Methods
    curr_y = div_y - 0.25
    for m in methods:
        ax.text(x + 0.15, curr_y, m, fontsize=8.5, color="#0F172A", family='monospace')
        curr_y -= 0.28

# 1. InputValidator
draw_class(0.5, 4.5, 4.8, 3.5, "InputValidator",
           ["- ABSOLUTE_ZERO: Object", "- NUMERIC_REGEX: RegExp", "- MAX_LIMIT: Number"],
           ["+ validate(rawInput, unit): ValidationResult", "- checkFinite(val): Boolean", "- checkLowerBound(val, unit): Boolean"])

# 2. TemperatureConverter
draw_class(5.8, 4.5, 4.8, 3.5, "TemperatureConverter",
           ["+ EPSILON: Number", "- SCALE_SYMBOLS: Map"],
           ["+ convert(val, fromUnit, toUnit): Number", "+ celsiusToFahrenheit(c): Number", "+ fahrenheitToCelsius(f): Number", "+ celsiusToKelvin(c): Number", "+ formatPrecision(val, p): String"])

# 3. StorageManager
draw_class(0.5, 0.4, 4.8, 3.3, "StorageManager",
           ["- STORAGE_KEY: String", "- inMemoryFallback: Array", "- MAX_ENTRIES: Number = 30"],
           ["+ isLocalStorageAvailable(): Boolean", "+ saveEntry(entry: HistoryItem): Void", "+ getHistory(): Array<HistoryItem>", "+ clearHistory(): Void"])

# 4. UIController
draw_class(5.8, 0.4, 4.8, 3.3, "UIController",
           ["- dom: DOMElementMap", "- activeScale: String"],
           ["+ initEventListeners(): Void", "+ performConversion(recordHistory): Void", "+ resetForm(): Void", "+ copyResult(): Void", "+ renderHistoryTable(): Void"])

# Relationships
ax.annotate("", xy=(3.0, 4.5), xytext=(3.0, 3.7), arrowprops=dict(arrowstyle="->", lw=1.5, color="#1E3A8A"))
ax.annotate("", xy=(8.2, 4.5), xytext=(8.2, 3.7), arrowprops=dict(arrowstyle="->", lw=1.5, color="#1E3A8A"))
ax.annotate("", xy=(5.3, 2.0), xytext=(5.8, 2.0), arrowprops=dict(arrowstyle="->", lw=1.5, color="#1E3A8A"))
ax.text(5.5, 2.15, "uses", fontsize=8.5, ha='center', color="#475569")

plt.title("Figure 2: UML Class Diagram - Architectural Decomposition", fontsize=13, fontweight='bold', pad=15, color="#0F172A")
plt.tight_layout()
plt.savefig('diagrams/class_diagram.png', dpi=300)
plt.close()

# -------------------------------------------------------------
# 3. SEQUENCE DIAGRAM
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(10.5, 7.5), dpi=300)
ax.set_xlim(0, 10.5)
ax.set_ylim(0, 8)
ax.axis('off')

lifelines = [
    (1.2, "User"),
    (3.4, "UIController"),
    (5.7, "InputValidator"),
    (8.0, "TempConverter"),
    (9.8, "StorageManager")
]

for x, label in lifelines:
    # Header box
    box = patches.Rectangle((x - 0.8, 7.2), 1.6, 0.55, ec="#1E3A8A", fc="#DBEAFE", lw=1.5)
    ax.add_patch(box)
    ax.text(x, 7.47, label, ha='center', va='center', fontweight='bold', fontsize=9.5, color="#1E3A8A")
    # Lifeline dashed
    ax.plot([x, x], [0.6, 7.2], color="#94A3B8", lw=1.2, linestyle='--')

messages = [
    (1.2, 3.4, 6.7, "1. Enters '100', selects 'C' to 'F', clicks Convert", False),
    (3.4, 5.7, 6.0, "2. validate('100', 'C')", False),
    (5.7, 3.4, 5.3, "3. return { isValid: true, value: 100 }", True),
    (3.4, 8.0, 4.6, "4. convert(100, 'C', 'F')", False),
    (8.0, 3.4, 3.9, "5. return 212.0", True),
    (3.4, 3.4, 3.2, "6. formatPrecision(212.0, 4) -> '212.0000'", False),
    (3.4, 9.8, 2.5, "7. saveEntry(historyRecord)", False),
    (9.8, 3.4, 1.8, "8. ack (saved to localStorage / fallback)", True),
    (3.4, 1.2, 1.1, "9. Render '212.0000 °F' & update History Table", True)
]

for x1, x2, y, text, is_return in messages:
    ls = '--' if is_return else '-'
    color = "#16A34A" if is_return else "#1D4ED8"
    if x1 == x2: # self call
        ax.plot([x1, x1 + 0.6, x1 + 0.6, x1], [y + 0.2, y + 0.2, y - 0.2, y - 0.2], color=color, lw=1.3)
        ax.annotate("", xy=(x1, y - 0.2), xytext=(x1 + 0.6, y - 0.2),
                    arrowprops=dict(arrowstyle="->", color=color, lw=1.3))
        ax.text(x1 + 0.7, y, text, fontsize=8.5, va='center', color="#0F172A")
    else:
        ax.annotate("", xy=(x2, y), xytext=(x1, y),
                    arrowprops=dict(arrowstyle="->", color=color, lw=1.4, linestyle=ls))
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y + 0.15, text, fontsize=8.5, ha='center', color="#0F172A", backgroundcolor='white')

plt.title("Figure 3: UML Sequence Diagram - Conversion & Persistence Workflow", fontsize=13, fontweight='bold', pad=15, color="#0F172A")
plt.tight_layout()
plt.savefig('diagrams/sequence_diagram.png', dpi=300)
plt.close()

# -------------------------------------------------------------
# 4. COMPONENT ARCHITECTURE & RISK MITIGATION DIAGRAM
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(10.5, 6), dpi=300)
ax.set_xlim(0, 10.5)
ax.set_ylim(0, 6)
ax.axis('off')

# Layers
layers = [
    (0.5, 4.3, 9.5, 1.3, "Presentation Layer (DOM / UI Controller)", "#EFF6FF", "#3B82F6",
     "HTML5 / CSS3 Responsive UI • User Controls • Dynamic Formula Breakdown • Presets"),
    (0.5, 2.5, 9.5, 1.3, "Business & Validation Logic Layer", "#F0FDF4", "#22C55E",
     "InputValidator (Thermodynamic Limits) • TemperatureConverter (IEEE 754 High Precision)"),
    (0.5, 0.7, 9.5, 1.3, "Persistence & Resiliency Layer", "#FEF3C7", "#EAB308",
     "StorageManager • Window.localStorage API • In-Memory Array Fallback for Private Browsing")
]

for x, y, w, h, title, fc, ec, desc in layers:
    box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1", ec=ec, fc=fc, lw=2)
    ax.add_patch(box)
    ax.text(x + 0.3, y + h - 0.35, title, fontsize=11, fontweight='bold', color="#1E293B")
    ax.text(x + 0.3, y + 0.35, desc, fontsize=9, color="#475569")

# Connecting bidirectional arrows between layers
ax.annotate("", xy=(5.25, 4.3), xytext=(5.25, 3.8), arrowprops=dict(arrowstyle="<->", lw=2, color="#475569"))
ax.annotate("", xy=(5.25, 2.5), xytext=(5.25, 2.0), arrowprops=dict(arrowstyle="<->", lw=2, color="#475569"))

plt.title("Figure 4: Client-Side Modular Architecture & Resiliency Stack", fontsize=13, fontweight='bold', pad=15, color="#0F172A")
plt.tight_layout()
plt.savefig('diagrams/system_architecture.png', dpi=300)
plt.close()

print("All 4 diagrams successfully generated in diagrams/ directory.")
