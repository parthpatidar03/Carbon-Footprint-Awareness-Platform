# 🌿 EcoTrace — Carbon Footprint Awareness Platform

> *Small Actions. Greener Future.*

A premium, nature-inspired web application that helps individuals understand, track, and reduce their carbon footprint through simple daily actions, a growing virtual forest, gamified progression, and positive AI coaching.

---

## 🌱 Challenge Vertical

**Challenge 3 — Carbon Footprint Awareness Platform**

> Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

---

## 🎯 Approach & Logic

### Design Philosophy — "Living Earth"
Instead of building a data dashboard, EcoTrace creates an **emotional, nature-connected experience**. Users don't stare at CO₂ numbers — they watch a digital forest grow as their habits improve.

The visual language is inspired by:
- 🍃 Apple Environmental pages
- 🏔️ Patagonia brand aesthetics
- 🧘 Headspace calm, human-centered UI
- 🦆 Ecosia/Duolingo gamification principles

### Core Design Principles
- **Organic shapes** over sharp rectangles
- **Soft natural gradients** using the Living Earth palette
- **Large whitespace** — calm, spacious layouts
- **Conversational inputs** instead of complex forms
- **Nature metaphors** to represent progress and impact

---

## 🏗️ How It Works

### 1. Landing Page
Beautiful hero section with a living landscape visualization, animated clouds, swaying trees, and a flowing river. CTA leads users into the personal forest dashboard.

### 2. Living Forest Dashboard
A dynamic SVG-based digital ecosystem that **grows over time** as the user logs eco-friendly habits:
- New oak and pine trees appear with each positive log
- Wildflowers bloom alongside active habits
- Birds appear when footprint is significantly offset

### 3. Conversational Daily Log
Instead of complex data forms, users answer 3 friendly questions:
1. 🚶 *"How did you commute today?"* — Walk/Bike/Transit/Car
2. 🥦 *"What did your meals look like?"* — Vegan/Vegetarian/Mixed/Heavy Meat
3. ⚡ *"Any green actions?"* — Unplug devices / Short shower / No plastics

Each positive selection generates **immediate forest feedback** — trees grow, flowers bloom.

### 4. Gamification System
Progress tracked through a 6-tier rank system:

| Level | Rank |
|-------|------|
| 1 | 🌱 Seed |
| 2 | 🌿 Sprout |
| 3 | 🪴 Plant |
| 4 | 🌳 Tree |
| 5 | 🌲 Forest Guardian |
| 6 | 🌍 Earth Champion |

XP earned from:
- Daily logs (+30 XP)
- Challenge completions (+20–50 XP)
- Badge unlocks (+50 XP)

### 5. Eco Challenges
Commitment-based daily actions:
- **Meatless Day** — Eat vegan/vegetarian all day
- **Pedal Power** — Walk or cycle instead of driving
- **Vampire Unplug** — Disconnect all idle electronics

### 6. Ecosystem Badges
Nature-themed achievements unlocked through sustained eco actions:
- 🌱 First Sprout — First daily log
- 🚴 Carbon Shredder — Log active transit 2 times
- 🌲 Forest Ally — Reach Level 3
- 🥦 Green Chef — Log 3 vegan meals

### 7. AI Forest Coach
An encouraging sustainability coach delivers personalized, guilt-free insights:
> *"Walking/biking prevents carbon pollution while building strong cardiorespiratory fitness."*

Never blames. Always empowers.

### 8. Community Forest
A shared ecosystem visualization where the community collectively grows trees toward global goals.

---

## 💡 Assumptions Made

- No backend required — uses **localStorage** for full data persistence across sessions
- CO₂ calculations use simplified, approximate emission factors per activity type
- "AI insights" are rule-based coaching tips targeted at highest-impact categories (simulated AI)
- Community data uses realistic mock users to demonstrate the shared forest visualization

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | Semantic HTML5 |
| Styling | Vanilla CSS3 (Living Earth Design System) |
| Logic | Vanilla JavaScript (ES6+) |
| Icons | Lucide Icons (CDN) |
| Fonts | Sora + Plus Jakarta Sans (Google Fonts) |
| Visualization | Native SVG DOM manipulation |
| Storage | Browser localStorage |

---

## 📁 Project Structure

```
CarbonFootPrint/
├── index.html          # App structure, landing page, dashboard UI
├── style.css           # Living Earth design system, animations, responsive layout
└── app.js              # Application logic, forest engine, gamification, conversational flow
```

---

## 🚀 Running Locally

1. Clone the repository:
```bash
git clone https://github.com/parthpatidar03/Carbon-Footprint-Awareness-Platform.git
cd Carbon-Footprint-Awareness-Platform
```

2. Serve via any local HTTP server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js serve package
npx serve .
```

3. Open `http://localhost:8000` in your browser.

> ⚠️ Must be served via HTTP (not file://) for Google Fonts and Lucide icons CDN to load correctly.

---

## 📊 Evaluation Coverage

| Criterion | Implementation |
|-----------|---------------|
| **Code Quality** | Modular JS with clear state management, separation of concerns, descriptive naming |
| **Security** | Pure client-side, no user data sent externally, localStorage sandboxed to origin |
| **Efficiency** | Zero build dependencies, native SVG rendering, lightweight CDN-only externals |
| **Testing** | Fully verifiable via browser E2E flow — Landing → Log → Forest Growth → XP Update |
| **Accessibility** | Semantic HTML5 elements, sufficient color contrast ratios, keyboard-navigable buttons |

---

## 📸 Preview

Built for **PromptWars Virtual — Challenge 3**

> *"A living ecosystem that grows as users make environmentally responsible decisions."*

---

*Made with 🌿 using AI-assisted development for PromptWars by Parth Patidar*
