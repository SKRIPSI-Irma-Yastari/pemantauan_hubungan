# Design System Specification: Samudra Analytics

## 1. Overview & Creative North Star
**Creative North Star: The Sovereign Clarity**
For BPMA, we are moving away from the "cluttered dashboard" trope. This design system treats data as a high-end editorial piece—authoritative, calm, and crystalline. By blending the precision of Shadcn-inspired minimalism with an "Institutional Luminary" aesthetic, we create a sense of inevitable trust. 

The system breaks the standard "box-in-a-box" grid through **intentional asymmetry** and **tonal layering**. We use generous white space (macro-spacing) to allow complex Migas (Oil & Gas) data to breathe, ensuring that every metric feels like a curated insight rather than a raw number.

---

## 2. Colors: Tonal Architecture
We prioritize a "No-Line" rule. Structural boundaries are defined by background shifts, not strokes.

### Color Tokens (Material Convention)
*   **Primary (Indigo):** `#0053db` (The core of navigation and authority)
*   **Secondary (Slate):** `#506076` (For functional utility)
*   **Tertiary (Emerald/Harmonious):** `#006d4a` (Positive status/Stability)
*   **Error (Rose/Less Harmonious):** `#9f403d` (Critical attention)
*   **Surface Hierarchy:**
    *   `surface-container-lowest`: `#ffffff` (Floating cards)
    *   `surface-container-low`: `#f0f4f7` (Secondary sections)
    *   `surface`: `#f7f9fb` (Global canvas)

### The "No-Line" Rule
Explicitly prohibit 1px solid borders for sectioning. Use `surface-container-low` sections sitting on a `surface` background to define areas. Boundaries are felt, not seen.

### The Glass & Gradient Rule
For high-impact CTAs or "Hero" metrics, use a **Signature Texture**: a subtle linear gradient from `primary` (#0053db) to `primary-dim` (#0048c1) at a 135-degree angle. Floating navigation or modals should utilize **Glassmorphism**: `surface-container-lowest` at 80% opacity with a `20px` backdrop-blur.

---

## 3. Typography: Editorial Authority
We use a dual-font system to balance technical precision with institutional scale.

*   **Display & Headlines (Manrope):** Chosen for its geometric stability. Use `display-lg` (3.5rem) and `headline-md` (1.75rem) to create a clear "anchor" for the page.
*   **Body & Labels (Inter):** The workhorse for data. `body-md` (0.875rem) is the default for all technical readouts to maximize legibility in dense tables.
*   **Hierarchy Note:** Always pair a `headline-sm` with a `label-sm` in `on-surface-variant` (muted gray) to provide immediate context without visual noise.

---

## 4. Elevation & Depth: The Layering Principle
Depth is achieved through **Tonal Layering** rather than traditional drop shadows.

*   **Stacking:** Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f0f4f7) sidebar. This creates a soft, natural lift.
*   **Ambient Shadows:** For floating elements (Modals/Popovers), use an extra-diffused shadow: `0 20px 40px rgba(42, 52, 57, 0.06)`. The tint is derived from `on-surface`, not pure black.
*   **The Ghost Border Fallback:** If a border is required for accessibility, use `outline-variant` (#a9b4b9) at **15% opacity**. High-contrast borders are strictly forbidden as they "trap" the data.

---

## 5. Components: Precision Primitives

### Cards & Data Lists
*   **Constraint:** Forbid divider lines between list items. Use 12px of vertical white space or a subtle hover state shift to `surface-container-high`.
*   **Style:** Cards use `rounded-lg` (0.5rem) and no border. Depth is provided by the `surface-container-lowest` fill against the `surface` background.

### Buttons (The Action Set)
*   **Primary:** `primary` fill, `on-primary` text. Use a subtle `4px` blur shadow of the same color for a "glow" effect on hover.
*   **Secondary:** `surface-container-high` fill. No border. This keeps the UI feeling integrated.
*   **Tertiary:** Ghost style. Only text and icon, shifting to `surface-container-low` on hover.

### Status Chips (Harmonious vs. Less Harmonious)
*   **Harmonious:** `tertiary-container` (#69f6b8) background with `on-tertiary-container` (#005a3c) text.
*   **Less Harmonious:** `error-container` (#fe8983) at 20% opacity with `error` (#9f403d) text.
*   **Shape:** Always `rounded-full` to contrast against the semi-rigid card structures.

### Input Fields
*   Background: `surface-container-lowest`. 
*   Border: `ghost-border` (15% opacity outline).

*   Focus State: A 2px `primary` ring with a 4px offset.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts (e.g., a wide data visualization next to a narrow insight column) to guide the eye.
*   **Do** lean on the `surface-container` tiers to create hierarchy.
*   **Do** use `label-sm` in all-caps with `0.05em` letter spacing for technical metadata.

### Don't
*   **Don't** use 100% opaque black or grey borders.
*   **Don't** use standard "Drop Shadows" from component libraries; always use the Ambient Shadow spec.
*   **Don't** use more than one "Primary" action per viewport. The BPMA dashboard must feel "decided" and "directed."
*   **Don't** use dividers to separate rows in a table. Use alternating tonal rows (`surface` vs `surface-container-low`) if necessary, or simply white space.

---

## 7. Signature BPMA Component: The "Stability Gauge"
A custom data visualization component specifically for Migas monitoring. It uses a thick, semi-circular track in `surface-container-highest` with a `tertiary` (Emerald) or `error` (Rose) gradient fill based on the "Harmonious" index. It sits inside a `glassmorphic` container to signify its status as a high-level KPI.
