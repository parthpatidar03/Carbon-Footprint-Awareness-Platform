# PromptWars Master Guidelines & Optimization Playbook

This playbook documents key architectural, security, testing, accessibility, and design guidelines compiled from the development of **EcoTrace**. Implement these rules in every project to ensure maximum scores (95-100/100) from automated evaluators (like Hack2Skill AI Score).

---

## 1. Project Evaluation & Error Retrospective

### Security (Original: 70/100 ➔ Optimized: 100/100)
*   **The Issue:** Excessive use of `.innerHTML` with dynamic variables (e.g., `dotsEl.innerHTML = ...`, `ch.title`, `ins.text`). Scanners flags this as an XSS (Cross-Site Scripting) vector because untrusted data (even from LocalStorage) could contain executable HTML/JS.
*   **The Fix:** 
    *   Transitioned to safe DOM creation APIs (`document.createElement()`, `classList.add()`, `.textContent`, `appendChild()`).
    *   Dynamic SVG assets in `renderForest()` were refactored to use `document.createElementNS("http://www.w3.org/2000/svg", tag)` instead of `.insertAdjacentHTML()`.
    *   All user-supplied or loaded data is inserted via `.textContent` or explicitly sanitized.

### Accessibility (Original: 45/100 ➔ Optimized: 100/100)
*   **The Issue:** Non-semantic HTML, lack of keyboard-navigable tabs, missing ARIA tags, and unlabeled dynamic SVGs. Bottom navigation tabs used `<a>` tags with `href="#"` and `onclick`, which is an accessibility anti-pattern.
*   **The Fix:**
    *   Converted bottom nav anchors to `<button>` elements with reset CSS, adding explicit `aria-label` tags.
    *   Added `role="dialog" aria-modal="true" aria-labelledby="onboarding-title"` to modals/overlays.
    *   Added descriptive `role="img" aria-label="..."` to progress-indicative SVGs (`svg-hero-forest`, `dynamic-forest-svg`) and `aria-hidden="true"` to decorative SVGs/icons (`river-svg`, Lucide `<i>` elements).
    *   Added explicit labels and screen-reader descriptive texts for dynamic buttons.

### Testing (Original: 0/100 ➔ Optimized: 100/100)
*   **The Issue:** No automated testing suite or configuration present. Evaluators looking for unit test files (`*.test.js`) returned zero points.
*   **The Fix:**
    *   Initialized `package.json` with a standard testing dependency (`jest`).
    *   Created `tests/app.test.js` containing robust assertions covering core business rules (experience calculation, levels, badges, streaks).
    *   Refactored `app.js` to run safely in both browser and Node/testing contexts by safeguarding DOM references (`if (typeof document !== 'undefined')`) and conditionally exporting functions (`module.exports`).

---

## 2. Master Checklist for AI Evaluation Metrics

### 🛡️ Security Checklists
1.  **No Direct HTML Insertion:** Never use `element.innerHTML = variable` unless the variable is hardcoded or fully sanitized. Use `.textContent` for text updates.
2.  **Element Construction:** Use `document.createElement()` and `element.appendChild()` to build dynamic lists, cards, and buttons.
3.  **SVG Namespaces:** When building SVGs programmatically, always use the SVG XML namespace:
    ```javascript
    const svgEl = document.createElementNS("http://www.w3.org/2000/svg", tag);
    ```
4.  **Sanitize LocalStorage:** Treat data pulled from `localStorage` as untrusted. Parse inside `try-catch` blocks and validate properties before setting state.

### ♿ Accessibility (a11y) Checklists
1.  **Tab & Anchor Semantics:** Use `<button>` for actions, tab switching, and overlays. Use `<a>` only for real page navigation.
2.  **Aria Hiding:** Add `aria-hidden="true"` to decorative elements, icons (e.g. `<i data-lucide="...">`), and waves/div dividers.
3.  **Image & SVG Alt Text:** Every `<img>` needs `alt`. Every visual SVG needs `role="img" aria-label="description"`.
4.  **Semantic Headings:** Always follow hierarchical ordering: `<h1>` ➔ `<h2>` ➔ `<h3>`. Never skip levels for styling.
5.  **Interactive Elements:** Ensure buttons have visible `:focus-visible` states. Avoid removing outlines unless replacing them with high-contrast custom rings.

### 🧪 Testing Checklists
1.  **Setup package.json:** Include a test script: `"test": "jest"` or `"test": "vitest run"`.
2.  **Modular Exports:** Protect Node.js imports inside pure client-side code:
    ```javascript
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { myFunction, myState };
    }
    ```
3.  **Environment Safety Guards:** Prevent scripts from crashing under Node context:
    ```javascript
    if (typeof window !== 'undefined') { ... }
    if (typeof document !== 'undefined') { ... }
    ```
4.  **Write Pure Logic Tests:** Focus tests on pure functions (calculators, logic engines, state updates) so you don't need heavy DOM mocking engines in simple hackathons.

---

## 3. UI Design Alignment by Problem Statement

A great user interface should visually represent the thematic core of the problem statement. Align the typography, palette, shapes, and micro-interactions with the domain.

### Category A: Nature, Eco, Sustainability (e.g., EcoTrace)
*   **Aesthetic:** Warm, grounded, calming.
*   **Colors:** 
    *   Sage & Leaf Green (`#4CAF50`, `#A5D6A7`) — growth, progress.
    *   Earth Brown (`#8D6E63`) — foundations, wood.
    *   Soft Sand & Off-white (`#F8FAF7`, `#E8E0D5`) — low eye strain, clean background.
*   **Design Elements:** Soft, organic borders (e.g. `border-radius: 24px`), custom fluid blob backgrounds, floating suns, cloud animations.
*   **Ecosystem Feedback:** Grow visual objects (e.g. SVGs planting trees, blooming flowers) to track environmental impact.

### Category B: Finance, Fintech, Investment
*   **Aesthetic:** Clean, high-tech, trustworthy, premium.
*   **Colors:**
    *   Deep Charcoal/Slate (`#0F172A`, `#1E293B`) — solid backdrop, premium look.
    *   Emerald Green/Cyan (`#10B981`, `#06B6D4`) — wealth, positive trends.
    *   Electric Indigo (`#6366F1`) — secondary accent.
*   **Design Elements:** Sharp, modern corners (e.g., `border-radius: 12px`), glassmorphism cards, subtle grid line patterns.
*   **Ecosystem Feedback:** Interactive charts, trend arrows, balance calculators, glowing micro-animations on value updates.

### Category C: Health, Wellbeing, Fitness
*   **Aesthetic:** Fresh, active, clean, supportive.
*   **Colors:**
    *   Bright Coral/Sunset Orange (`#FF6B6B`, `#FF8E53`) — energy, movement.
    *   Calming Teal/Soft Lavender (`#20C997`, `#748FFC`) — recovery, calm state.
    *   Pure White (`#FFFFFF`) — hygienic feeling.
*   **Design Elements:** Large circular progress indicators (rings), rounded cards, clean sans-serif typography (e.g., Outfit/Inter).
*   **Ecosystem Feedback:** Radial progress indicators, streak fires, habit completion checkmark bounce animations.

### Category D: Productivity, Coding, Tech Tools
*   **Aesthetic:** High efficiency, dark mode, futuristic, structured.
*   **Colors:**
    *   Deep Void Dark (`#0B0F19`) — deep focus background.
    *   Neon Purple/Pink (`#A855F7`, `#EC4899`) — tech highlights.
    *   Cyber Amber/Lime (`#F59E0B`, `#84CC16`) — indicators/warnings.
*   **Design Elements:** Command palettes, monospaced details, terminal-styled prompt cards, retro scanline overlays.
*   **Ecosystem Feedback:** Keyboard shortcuts, quick command completions, status bars, data graphs.
