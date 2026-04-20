# Design System Strategy: Sovereign Clarity

## 1. Overview & Creative North Star: "The Digital Sovereign"
This design system is anchored by the concept of **Sovereign Clarity**. It moves beyond the utilitarian aesthetics of standard data dashboards to create a "Digital Sovereign" experience: an environment that feels authoritative, institutional, yet profoundly breathable. 

Instead of a rigid grid of boxes, we utilize an editorial layout inspired by high-end financial journals and institutional archives. We break the "template" look through:
*   **Intentional Asymmetry:** Heavy-weight typography balanced against expansive white space.
*   **Tonal Architecture:** Defining hierarchy through depth and color density rather than structural lines.
*   **Oceanic Depth:** Utilizing the deep slate `#0F172A` (Primary Container) as a foundation for data, allowing the purple "Luminary" accents to guide the user's eye toward critical insights.

---

## 2. Colors & The "No-Line" Rule
The palette is a sophisticated interplay between deep institutional slates and a refined regal purple.

### Color Tokens
*   **Primary Container (`#131b2e`):** The "Samudra" Slate. Used for headers, sidebars, and high-impact data visualizations.
*   **Secondary (`#6f43c0`):** The "Luminary" Purple. Used for active states, primary CTAs, and Aceh-specific regional highlights.
*   **Surface (`#faf9fd`):** The canvas. A cool, expansive neutral that prevents the UI from feeling "heavy."

### The "No-Line" Rule
**Explicit Instruction:** Prohibit 1px solid borders for sectioning. Boundaries must be defined solely through:
1.  **Background Color Shifts:** A `surface-container-low` section sitting on a `surface` background.
2.  **Tonal Transitions:** Using `surface-container-highest` to define a header area without a stroke line.
3.  **Negative Space:** Using the spacing scale to create distinct "islands" of information.

### Signature Textures
*   **Glassmorphism:** For floating overlays (e.g., map tooltips), use `surface_container_lowest` with a 12px `backdrop-blur` and 80% opacity.
*   **Institutional Gradients:** Main CTAs or active map regions should use a subtle linear gradient from `secondary` (#6f43c0) to `secondary_container` (#a97efd) at a 135-degree angle.

---

## 3. Typography: The Editorial Scale
We pair **Manrope** (The Authority) with **Inter** (The Precision).

| Level | Font | Size | Intent |
| :--- | :--- | :--- | :--- |
| **Display-LG** | Manrope | 3.5rem | High-level regional totals (e.g., Aceh GDP). |
| **Headline-MD** | Manrope | 1.75rem | Section titles and institutional reports. |
| **Title-SM** | Inter | 1rem | Card headers and data groupings. |
| **Body-MD** | Inter | 0.875rem | Narrative analytics and survey descriptions. |
| **Label-MD** | Inter | 0.75rem | All-caps, tracked out (+5%) for metadata. |

**Hierarchy Note:** Use `on_surface_variant` (#45464d) for body text to reduce visual vibration against the bright surface, reserving `on_surface` (#1a1b1e) for headlines.

---

## 4. Elevation & Depth: Tonal Layering
Depth is achieved through "stacking" rather than drop shadows.

*   **The Layering Principle:** 
    *   **Level 0 (Base):** `surface`
    *   **Level 1 (Sections):** `surface_container_low`
    *   **Level 2 (Cards/Forms):** `surface_container_lowest` (White)
*   **Ambient Shadows:** If an element must float (e.g., a mapping modal), use a shadow: `0px 20px 40px rgba(15, 23, 42, 0.06)`. Note the tint of the Primary Container in the shadow.
*   **The Ghost Border:** If a boundary is strictly required for accessibility, use `outline_variant` at **15% opacity**. Never 100%.

---

## 5. Specialized Components

### Survey Forms (BPMA Focus)
*   **The Stage Pattern:** Questions are housed in `surface_container_lowest` containers with wide internal padding (2rem). 
*   **Active State:** When an input is focused, the entire container gains a subtle `secondary_fixed` (#ebddff) background tint, rather than just a border change.
*   **Inputs:** No bottom lines or full boxes. Use a soft-filled background (`surface_variant`) with a 4px bottom radius.

### Data Tables (Institutional Analytics)
*   **Zero-Border Construction:** Remove all vertical and horizontal lines.
*   **Zebra-Tonal Shift:** Use `surface_container_low` for even rows and `surface_container_lowest` for odd rows.
*   **Header:** `primary_container` background with `on_primary` (White) Manrope text. This anchors the data with "Sovereign" weight.

### Regional Mapping (Aceh Focus)
*   **Base Map:** Use a simplified vector map in `surface_dim`.
*   **Regional Hotspots:** Use the `secondary` purple palette.
*   **Focus Points:** Regions of interest in Aceh should use a "Pulsing Luminary" effect—a `secondary_container` fill with a soft glow (diffused shadow in purple).
*   **Map Legend:** A floating glassmorphic panel in the bottom-right corner using `surface_container_lowest` + `backdrop-blur`.

---

## 6. Do's and Don'ts

### Do
*   **DO** use whitespace as a separator. If you feel the need for a line, add 16px of padding instead.
*   **DO** use `Manrope` for any number that represents a "Result" or "Key Metric."
*   **DO** use `surface_container_high` to highlight a "Selected" row in a data table.

### Don't
*   **DON'T** use pure black (#000000) for body text; it breaks the "Sovereign Clarity" softness.
*   **DON'T** use standard 1px borders for cards. Use the tonal shift from `surface` to `surface_container_low`.
*   **DON'T** use bright, saturated \"Action Blue.\" Use the `secondary` purple or the deep `primary_container` slate for all primary actions.
