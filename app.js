// ================================================================
// EcoTrace — Living Earth App
// Features: Onboarding Quiz, Today's Tip, 7-Day Streak Dots,
//           Impact Toast, Richer Forest, Contextual AI Coach
// ================================================================

// ---- DAILY TIPS BANK ----
const DAILY_TIPS = [
    "Taking the bus twice a week saves around 1,000 kg of CO₂ a year — same as planting 45 trees.",
    "Eating vegan just once a day saves more water than not showering for 6 months.",
    "Unplugging your charger when not in use saves up to 10% on your energy bill annually.",
    "Cycling 5km instead of driving prevents roughly 1.2 kg of CO₂ from entering the atmosphere.",
    "Buying one less piece of new clothing per year saves about 200 kg of CO₂.",
    "A short 5-minute shower uses 35 litres of water vs. a bath that uses 150 litres.",
    "Composting kitchen waste can reduce household methane emissions by up to 25%.",
    "Switching to LED bulbs uses 75% less energy than traditional incandescent lights.",
    "Carrying a reusable bag prevents the production of 500+ plastic bags per year.",
    "Eating locally grown food can cut food transport emissions by up to 15%.",
    "Air drying clothes instead of tumble drying saves about 700g of CO₂ per load.",
    "Reducing meat intake by 50% can halve your diet-related carbon footprint.",
    "Trees in urban areas can reduce city temperatures by 1–5°C through shade and transpiration.",
    "Turning off lights when leaving a room can save over 200 kg of CO₂ per year.",
    "Choosing tap water over bottled water prevents production of 600g of CO₂ per litre."
];

// ---- ONBOARDING QUIZ QUESTIONS ----
const ONBOARDING_QUIZ = [
    {
        q: "What's your biggest daily habit challenge?",
        sub: "We'll personalize your challenges around this.",
        options: [
            { emoji: "🚗", text: "Getting around without a car", value: "transport" },
            { emoji: "🥩", text: "Eating less meat and dairy", value: "diet" },
            { emoji: "⚡", text: "Reducing home energy use", value: "energy" }
        ]
    },
    {
        q: "How eco-conscious do you consider yourself?",
        sub: "No wrong answers — just helps us set expectations.",
        options: [
            { emoji: "🌱", text: "Just getting started", value: "beginner" },
            { emoji: "🌿", text: "I try, but could do more", value: "moderate" },
            { emoji: "🌳", text: "I'm pretty committed already", value: "advanced" }
        ]
    },
    {
        q: "What motivates you most to act?",
        sub: "We'll focus your coach messages around this.",
        options: [
            { emoji: "💪", text: "Personal health and wellbeing", value: "health" },
            { emoji: "🌍", text: "Protecting nature and wildlife", value: "nature" },
            { emoji: "👶", text: "A better future for the next generation", value: "future" }
        ]
    }
];

// ---- RANK CONFIG ----
const RANKS = [
    { name: 'Seed', emoji: '🌱', minLevel: 1 },
    { name: 'Sprout', emoji: '🌿', minLevel: 2 },
    { name: 'Plant', emoji: '🪴', minLevel: 3 },
    { name: 'Tree', emoji: '🌳', minLevel: 4 },
    { name: 'Forest Guardian', emoji: '🌲', minLevel: 5 },
    { name: 'Earth Champion', emoji: '🌍', minLevel: 6 }
];

// ---- CONVERSATIONAL LOG STEPS ----
const CONVO_STEPS = {
    1: {
        question: "🌱 Hello! How did you commute today?",
        options: [
            { text: "🚶 Walked / Cycled", value: "active", co2Offset: 5.2 },
            { text: "🚌 Public Transit", value: "transit", co2Offset: 2.8 },
            { text: "🚗 Drove alone", value: "car", co2Offset: -4.0 },
            { text: "🏠 Worked from home", value: "home", co2Offset: 3.5 }
        ]
    },
    2: {
        question: "🥗 Great! What did your meals look like today?",
        options: [
            { text: "🥦 Plant Based", value: "vegan", co2Offset: 4.5 },
            { text: "🥚 Vegetarian", value: "vege", co2Offset: 2.5 },
            { text: "🥩 Mixed meals", value: "mixed", co2Offset: 0.5 },
            { text: "🍔 Meat-heavy day", value: "heavy", co2Offset: -3.0 }
        ]
    },
    3: {
        question: "⚡ Last one! Any green actions today?",
        options: [
            { text: "💡 Unplugged idle devices", value: "power", co2Offset: 1.5 },
            { text: "🚿 Short shower (<5 min)", value: "water", co2Offset: 1.2 },
            { text: "🛍️ Avoided single-use plastics", value: "plastic", co2Offset: 0.8 },
            { text: "✨ Nothing special today", value: "none", co2Offset: 0.0 }
        ]
    }
};

// ---- APP STATE ----
let appState = {
    user: {
        name: 'Parth Patidar',
        xp: 0,
        level: 1,
        streak: 0,
        onboardingDone: false,
        onboardingAnswers: {}
    },
    forest: {
        trees: [
            { x: 50, y: 150, type: 'oak', scale: 0.8 },
            { x: 130, y: 138, type: 'pine', scale: 0.95 }
        ],
        flowers: [
            { x: 85, y: 172, color: '#F9A825' }
        ],
        birds: 0,
        bushes: [
            { x: 60, y: 178, size: 22 }
        ]
    },
    dailyLogs: [],
    challenges: [
        { id: 'ch-1', title: 'Meatless Day', desc: 'Eat vegetarian or vegan all day', xp: 30, progress: 0, target: 1, completed: false },
        { id: 'ch-2', title: 'Pedal Power', desc: 'Walk or cycle instead of driving', xp: 45, progress: 0, target: 1, completed: false },
        { id: 'ch-3', title: 'Vampire Unplug', desc: 'Unplug idle electronics tonight', xp: 20, progress: 0, target: 1, completed: false }
    ],
    badges: [
        { id: 'badge-1', name: 'First Sprout', desc: 'Log your first daily habit', icon: 'sprout', unlocked: false },
        { id: 'badge-2', name: 'Carbon Shredder', desc: 'Log active transit 2 times', icon: 'bike', unlocked: false },
        { id: 'badge-3', name: 'Forest Ally', desc: 'Reach Level 3', icon: 'trees', unlocked: false },
        { id: 'badge-4', name: 'Green Chef', desc: 'Log 3 vegan meals', icon: 'beef', unlocked: false }
    ]
};

let currentConvoStep = 1;
let currentConvoLog = { transit: null, diet: null, actions: [] };
let onboardingStep = 0;

const COMMUNITY_USERS = [
    { name: 'Aarav Sharma', rank: 'Forest Guardian', trees: 14, icon: 'A' },
    { name: 'Diya Patel', rank: 'Tree', trees: 7, icon: 'D' },
    { name: 'Karan Mehta', rank: 'Sprout', trees: 3, icon: 'K' }
];

// ================================================================
// INIT
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    renderDailyTip();
    renderForest();
    renderConvoStep();
    renderChallenges();
    renderAchievements();
    renderCommunity();
    renderAIInsights();
    updateUserLevelUI();
    renderStreakDots();
    lucide.createIcons();
});

// ---- STATE PERSISTENCE ----
function loadState() {
    const saved = localStorage.getItem('ecotrace_v3');
    if (saved) {
        try {
            const p = JSON.parse(saved);
            appState.user = { ...appState.user, ...p.user };
            appState.forest = { ...appState.forest, ...p.forest };
            appState.dailyLogs = p.dailyLogs || [];
            if (p.challenges) {
                appState.challenges.forEach(ch => {
                    const sc = p.challenges.find(c => c.id === ch.id);
                    if (sc) { ch.progress = sc.progress; ch.completed = sc.completed; }
                });
            }
            if (p.badges) {
                appState.badges.forEach(b => {
                    const sb = p.badges.find(s => s.id === b.id);
                    if (sb) b.unlocked = sb.unlocked;
                });
            }
        } catch(e) { console.error('State load error', e); }
    }
}
function saveState() {
    localStorage.setItem('ecotrace_v3', JSON.stringify(appState));
}

// ================================================================
// ROUTING — Landing → Onboarding → App
// ================================================================
function startOnboarding() {
    if (appState.user.onboardingDone) {
        enterApp();
        return;
    }
    onboardingStep = 0;
    document.getElementById('onboarding-overlay').style.display = 'flex';
    renderOnboardingStep();
}

function enterApp() {
    document.getElementById('landing-view').style.display = 'none';
    document.getElementById('onboarding-overlay').style.display = 'none';
    document.getElementById('app-view').style.display = 'grid';
    document.getElementById('bottom-nav').style.display = 'flex';
    document.getElementById('btn-enter-app').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchTab(tab, element) {
    document.querySelectorAll('.bottom-nav-item').forEach(i => i.classList.remove('active'));
    element.classList.add('active');
    if (tab === 'tracker') {
        document.getElementById('tracker-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ================================================================
// ONBOARDING QUIZ
// ================================================================
function renderOnboardingStep() {
    const q = ONBOARDING_QUIZ[onboardingStep];
    const dotsEl = document.getElementById('onboarding-dots');
    const content = document.getElementById('onboarding-content');

    // Draw progress dots
    dotsEl.innerHTML = ONBOARDING_QUIZ.map((_, i) =>
        `<div class="ob-dot ${i <= onboardingStep ? 'active' : ''}"></div>`
    ).join('');

    content.innerHTML = `
        <p class="ob-question">${q.q}</p>
        <p class="ob-sub">${q.sub}</p>
        <div class="ob-options">
            ${q.options.map(opt => `
                <button class="ob-option-btn" onclick="selectOnboardingAnswer('${opt.value}')">
                    <span class="ob-emoji">${opt.emoji}</span>
                    <span>${opt.text}</span>
                </button>
            `).join('')}
        </div>
    `;
}

function selectOnboardingAnswer(value) {
    const key = ['challenge', 'level', 'motivation'][onboardingStep];
    appState.user.onboardingAnswers[key] = value;
    onboardingStep++;

    if (onboardingStep >= ONBOARDING_QUIZ.length) {
        // Quiz complete — personalize + enter
        appState.user.onboardingDone = true;
        personalizeFromOnboarding();
        saveState();
        enterApp();
        renderAIInsights(); // Refresh with personalized tips
    } else {
        renderOnboardingStep();
    }
}

function personalizeFromOnboarding() {
    const challenge = appState.user.onboardingAnswers.challenge;
    // Reorder challenges to put relevant one first
    if (challenge === 'transport') {
        appState.challenges.sort((a, b) => (a.id === 'ch-2' ? -1 : 1));
    } else if (challenge === 'diet') {
        appState.challenges.sort((a, b) => (a.id === 'ch-1' ? -1 : 1));
    } else if (challenge === 'energy') {
        appState.challenges.sort((a, b) => (a.id === 'ch-3' ? -1 : 1));
    }
}

// ================================================================
// DAILY TIP — Rotates based on day-of-year
// ================================================================
function renderDailyTip() {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const tip = DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
    const el = document.getElementById('daily-tip-text');
    if (el) el.textContent = tip;
}

// ================================================================
// FOREST RENDERING — Rich SVG ecosystem
// ================================================================
function renderForest() {
    const svg = document.getElementById('dynamic-forest-svg');
    if (!svg) return;
    svg.innerHTML = '';

    // Render bushes
    appState.forest.bushes.forEach(b => {
        svg.insertAdjacentHTML('beforeend', `
            <ellipse cx="${b.x}" cy="${200 - b.size * 0.4}" rx="${b.size}" ry="${b.size * 0.6}" fill="#7CB342" opacity="0.75"/>
            <ellipse cx="${b.x + b.size * 0.7}" cy="${200 - b.size * 0.3}" rx="${b.size * 0.7}" ry="${b.size * 0.45}" fill="#A5D6A7" opacity="0.7"/>
        `);
    });

    // Render Grass tufts
    const grassPositions = [90, 160, 220, 280, 330];
    grassPositions.forEach(gx => {
        svg.insertAdjacentHTML('beforeend', `
            <line x1="${gx}" y1="198" x2="${gx+4}" y2="${185 + Math.random()*8}" stroke="#4CAF50" stroke-width="2" stroke-linecap="round"/>
            <line x1="${gx+6}" y1="198" x2="${gx+8}" y2="${182 + Math.random()*10}" stroke="#7CB342" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="${gx+12}" y1="198" x2="${gx+13}" y2="${187 + Math.random()*7}" stroke="#4CAF50" stroke-width="1.5" stroke-linecap="round"/>
        `);
    });

    // Render Trees
    appState.forest.trees.forEach((tree, i) => {
        const delay = i * 0.3;
        if (tree.type === 'pine') {
            svg.insertAdjacentHTML('beforeend', `
                <g transform="translate(${tree.x}, ${tree.y}) scale(${tree.scale})" style="animation: sway ${5 + i}s infinite ease-in-out alternate; transform-origin: ${tree.x}px 200px;">
                    <rect x="-4" y="0" width="8" height="22" fill="#8D6E63"/>
                    <polygon points="0,-40 -22,-8 22,-8" fill="#1F4033"/>
                    <polygon points="0,-53 -17,-22 17,-22" fill="#2E5E4E"/>
                    <polygon points="0,-63 -11,-35 11,-35" fill="#A5D6A7"/>
                </g>
            `);
        } else {
            // Oak
            svg.insertAdjacentHTML('beforeend', `
                <g transform="translate(${tree.x}, ${tree.y}) scale(${tree.scale})" style="animation: sway ${4 + i * 0.7}s infinite ease-in-out alternate; transform-origin: ${tree.x}px 200px;">
                    <rect x="-5" y="0" width="10" height="26" fill="#8D6E63"/>
                    <circle cx="0" cy="-22" r="20" fill="#2E5E4E"/>
                    <circle cx="-11" cy="-28" r="15" fill="#4CAF50"/>
                    <circle cx="12" cy="-26" r="13" fill="#7CB342"/>
                    <circle cx="0" cy="-38" r="10" fill="#A5D6A7" opacity="0.8"/>
                </g>
            `);
        }
    });

    // Render Flowers
    appState.forest.flowers.forEach(f => {
        svg.insertAdjacentHTML('beforeend', `
            <g transform="translate(${f.x}, ${f.y})">
                <circle cx="0" cy="0" r="3.5" fill="${f.color}"/>
                <circle cx="-4.5" cy="0" r="2.5" fill="#FFFFFF" opacity="0.9"/>
                <circle cx="4.5" cy="0" r="2.5" fill="#FFFFFF" opacity="0.9"/>
                <circle cx="0" cy="-4.5" r="2.5" fill="#FFFFFF" opacity="0.9"/>
                <circle cx="0" cy="4.5" r="2.5" fill="#FFFFFF" opacity="0.9"/>
            </g>
        `);
    });

    // Birds (animated V-shapes in sky)
    for (let b = 0; b < appState.forest.birds; b++) {
        const bx = 20 + b * 70;
        const by = 25 + b * 15;
        svg.insertAdjacentHTML('beforeend', `
            <path class="bird-fly" d="M ${bx} ${by} Q ${bx+6} ${by-7} ${bx+12} ${by} Q ${bx+18} ${by-7} ${bx+24} ${by}"
                  fill="none" stroke="#5F6B65" stroke-width="1.8" stroke-linecap="round"
                  style="animation-delay: ${b * 3}s;"/>
        `);
    }

    // Sway keyframes injected once
    if (!document.getElementById('sway-keyframe')) {
        const style = document.createElement('style');
        style.id = 'sway-keyframe';
        style.textContent = `@keyframes sway { 0% { transform: rotate(-1.5deg); } 100% { transform: rotate(1.5deg); } }`;
        document.head.appendChild(style);
    }
}

// ================================================================
// CONVERSATIONAL DAILY LOG
// ================================================================
function renderConvoStep() {
    const container = document.getElementById('chat-options-container');
    const bubble = document.getElementById('coach-question');
    if (!container || !bubble) return;

    const step = CONVO_STEPS[currentConvoStep];
    bubble.textContent = step.question;
    container.innerHTML = '';

    step.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt.text;
        btn.addEventListener('click', () => selectOption(opt, btn));
        container.appendChild(btn);
    });
}

function selectOption(option, btn) {
    // Visual feedback — briefly highlight chosen
    btn.classList.add('selected');
    setTimeout(() => {
        if (currentConvoStep === 1) {
            currentConvoLog.transit = option;
            currentConvoStep = 2;
            renderConvoStep();
        } else if (currentConvoStep === 2) {
            currentConvoLog.diet = option;
            currentConvoStep = 3;
            renderConvoStep();
        } else if (currentConvoStep === 3) {
            if (option.value !== 'none') currentConvoLog.actions.push(option);
            completeConvoLog();
        }
    }, 200);
}

function completeConvoLog() {
    let offsetScore = 0;
    if (currentConvoLog.transit) offsetScore += currentConvoLog.transit.co2Offset;
    if (currentConvoLog.diet) offsetScore += currentConvoLog.diet.co2Offset;
    currentConvoLog.actions.forEach(a => { offsetScore += a.co2Offset; });

    // Grow forest based on score
    if (offsetScore > 3) {
        const nx = 160 + Math.random() * 180;
        appState.forest.trees.push({
            x: Math.round(nx), y: Math.round(128 + Math.random() * 32),
            type: Math.random() > 0.5 ? 'oak' : 'pine',
            scale: parseFloat((0.65 + Math.random() * 0.45).toFixed(2))
        });
        appState.forest.flowers.push({
            x: Math.round(50 + Math.random() * 310),
            y: Math.round(175 + Math.random() * 20),
            color: ['#F9A825','#EF5350','#EC407A','#AB47BC','#FF7043'][Math.floor(Math.random() * 5)]
        });
        // Add bush occasionally
        if (Math.random() > 0.6) {
            appState.forest.bushes.push({
                x: Math.round(80 + Math.random() * 240),
                size: Math.round(16 + Math.random() * 12)
            });
        }
    }
    if (offsetScore > 7 && appState.forest.birds < 4) {
        appState.forest.birds += 1;
    }

    // XP + badges + challenges
    gainXP(30);
    unlockBadge('badge-1');

    if (currentConvoLog.transit?.value === 'active') {
        incrementChallenge('ch-2');
        const cnt = appState.dailyLogs.filter(l => l.transit === 'active').length + 1;
        if (cnt >= 2) unlockBadge('badge-2');
    }
    if (currentConvoLog.diet?.value === 'vegan') {
        incrementChallenge('ch-1');
        const cnt = appState.dailyLogs.filter(l => l.diet === 'vegan').length + 1;
        if (cnt >= 3) unlockBadge('badge-4');
    }
    if (currentConvoLog.actions.find(a => a.value === 'power')) {
        incrementChallenge('ch-3');
    }

    // Save log
    appState.dailyLogs.push({
        date: new Date().toISOString().split('T')[0],
        transit: currentConvoLog.transit?.value || 'none',
        diet: currentConvoLog.diet?.value || 'none',
        score: offsetScore
    });

    // Update streak
    updateStreak();

    saveState();

    // Show impact toast
    showImpactToast(offsetScore);

    // Reset
    currentConvoStep = 1;
    currentConvoLog = { transit: null, diet: null, actions: [] };

    renderForest();
    renderConvoStep();
    renderAIInsights();
    renderChallenges();
    renderAchievements();
    updateUserLevelUI();
    renderStreakDots();
}

// ================================================================
// IMPACT TOAST
// ================================================================
const IMPACT_COMPARISONS = [
    (kg) => `= ${Math.round(kg / 0.12)} minutes of not driving`,
    (kg) => `= ${(kg / 0.05).toFixed(0)} km walked instead of driven`,
    (kg) => `≈ ${Math.round(kg / 5)} sapling's worth of annual absorption`,
    (kg) => `= charging a phone ${Math.round(kg / 0.008)} times`
];

function showImpactToast(offsetKg) {
    const toast = document.getElementById('impact-toast');
    if (!toast) return;
    if (offsetKg <= 0) {
        toast.textContent = "Every day is a new chance 🌱 Tomorrow, let's choose green!";
    } else {
        const fn = IMPACT_COMPARISONS[Math.floor(Math.random() * IMPACT_COMPARISONS.length)];
        toast.textContent = `🌿 Saved ~${offsetKg.toFixed(1)} kg CO₂ today  ${fn(offsetKg)}`;
    }
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4500);
}

// ================================================================
// 7-DAY STREAK DOTS
// ================================================================
function updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const logs = appState.dailyLogs;
    const logDates = [...new Set(logs.map(l => l.date))].sort();

    if (logDates.length === 0) { appState.user.streak = 1; return; }
    const last = logDates[logDates.length - 1];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (last === yesterday || last === today) {
        if (last !== today) appState.user.streak += 1;
    } else {
        appState.user.streak = 1;
    }
}

function renderStreakDots() {
    const container = document.getElementById('streak-dots');
    const countEl = document.getElementById('streak-count');
    if (!container) return;

    const today = new Date();
    const logDates = new Set(appState.dailyLogs.map(l => l.date));

    container.innerHTML = '';
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const isToday = i === 0;
        const isLogged = logDates.has(dateStr);
        const dot = document.createElement('div');
        dot.className = 'streak-dot' +
            (isLogged ? ' logged' : '') +
            (isToday && !isLogged ? ' today-empty' : '');
        dot.textContent = dayNames[d.getDay()];
        dot.title = isLogged ? `${dateStr} ✓` : dateStr;
        container.appendChild(dot);
    }
    if (countEl) countEl.textContent = appState.user.streak;
}

// ================================================================
// GAMIFICATION
// ================================================================
function gainXP(amount) {
    appState.user.xp += amount;
    const threshold = appState.user.level * 100;
    if (appState.user.xp >= threshold) {
        appState.user.xp -= threshold;
        appState.user.level += 1;
        if (appState.user.level >= 3) unlockBadge('badge-3');
    }
}

function unlockBadge(id) {
    const b = appState.badges.find(b => b.id === id);
    if (b && !b.unlocked) { b.unlocked = true; gainXP(50); }
}

function incrementChallenge(id) {
    const ch = appState.challenges.find(c => c.id === id);
    if (ch && !ch.completed) {
        ch.progress += 1;
        if (ch.progress >= ch.target) { ch.completed = true; gainXP(ch.xp); }
    }
}

function getRankForLevel(level) {
    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (level >= RANKS[i].minLevel) return RANKS[i];
    }
    return RANKS[0];
}

function updateUserLevelUI() {
    const rank = getRankForLevel(appState.user.level);
    document.getElementById('lbl-level').textContent = appState.user.level;
    document.getElementById('lbl-rank').textContent = rank.name;
    document.getElementById('lbl-xp').textContent = appState.user.xp;
    document.getElementById('lbl-next-xp').textContent = appState.user.level * 100;
    document.getElementById('progress-bar-fill').style.width =
        `${Math.round((appState.user.xp / (appState.user.level * 100)) * 100)}%`;
    document.getElementById('forest-eco-score').textContent = `${rank.emoji} ${rank.name}`;
    const rankEmoji = document.getElementById('rank-emoji');
    if (rankEmoji) rankEmoji.textContent = rank.emoji;
}

// ================================================================
// CHALLENGES
// ================================================================
function renderChallenges() {
    const container = document.getElementById('challenges-list');
    if (!container) return;
    container.innerHTML = '';
    appState.challenges.forEach(ch => {
        const div = document.createElement('div');
        div.style.cssText = 'padding:0.9rem 1rem;background:var(--bg-earth);border-radius:16px;display:flex;justify-content:space-between;align-items:center;';
        div.innerHTML = `
            <div>
                <strong style="display:block;font-family:var(--font-heading);color:var(--forest-dark);font-size:0.95rem;">${ch.title}</strong>
                <span style="font-size:0.8rem;color:var(--text-secondary);">${ch.desc}</span>
            </div>
            ${ch.completed
                ? `<span style="color:var(--leaf-green);font-weight:700;font-size:0.85rem;">✓ Done</span>`
                : `<button class="btn-nav-action" style="padding:0.4rem 1rem;font-size:0.8rem;" onclick="triggerChallenge('${ch.id}')">+${ch.xp} XP</button>`
            }
        `;
        container.appendChild(div);
    });
}

window.triggerChallenge = function(id) {
    incrementChallenge(id);
    saveState();
    renderChallenges();
    updateUserLevelUI();
};

// ================================================================
// ACHIEVEMENTS / BADGES
// ================================================================
function renderAchievements() {
    const container = document.getElementById('achievements-grid');
    if (!container) return;
    container.innerHTML = '';
    appState.badges.forEach(badge => {
        const icons = { sprout: 'sprout', bike: 'bike', trees: 'trees', beef: 'beef' };
        const div = document.createElement('div');
        div.className = `badge-leaf ${badge.unlocked ? 'unlocked' : ''}`;
        div.innerHTML = `
            <div class="badge-leaf-icon"><i data-lucide="${icons[badge.icon] || 'award'}"></i></div>
            <span>${badge.name}</span>
        `;
        container.appendChild(div);
    });
    lucide.createIcons();
}

// ================================================================
// COMMUNITY
// ================================================================
function renderCommunity() {
    const container = document.getElementById('community-users');
    if (!container) return;
    container.innerHTML = '';
    COMMUNITY_USERS.forEach(u => {
        const div = document.createElement('div');
        div.className = 'user-row';
        div.innerHTML = `
            <div class="user-details">
                <div class="user-avatar">${u.icon}</div>
                <div>
                    <strong style="display:block;font-size:0.9rem;">${u.name}</strong>
                    <span style="font-size:0.75rem;color:var(--text-secondary);">${u.rank}</span>
                </div>
            </div>
            <span style="font-weight:700;color:var(--primary-forest);font-size:0.85rem;">🌲 ${u.trees} trees</span>
        `;
        container.appendChild(div);
    });
}

// ================================================================
// AI INSIGHTS — Personalized from onboarding answers
// ================================================================
const INSIGHTS_MAP = {
    transport: [
        { icon: '🚶', text: 'Swapping one car trip for a walk or cycle per day saves around 500 kg CO₂ per year.' },
        { icon: '🚌', text: 'Public transit passengers emit 45% less CO₂ per km than solo car drivers on average.' }
    ],
    diet: [
        { icon: '🥦', text: 'A plant-based meal saves up to 6x more CO₂ than a beef-based equivalent.' },
        { icon: '🛒', text: 'Shopping at local farmers markets cuts food transport emissions by up to 15%.' }
    ],
    energy: [
        { icon: '💡', text: 'Switching all bulbs to LED and unplugging idle devices can cut home energy use by 20%.' },
        { icon: '🌡️', text: 'Lowering your thermostat by just 1°C reduces your heating bill and emissions by ~8%.' }
    ],
    default: [
        { icon: '🌳', text: 'Trees in urban areas reduce city temperatures by 1–5°C and improve air quality.' },
        { icon: '♻️', text: 'Recycling one aluminium can saves enough energy to power a TV for 3 hours.' }
    ]
};

function renderAIInsights() {
    const container = document.getElementById('ai-insights-block');
    if (!container) return;
    container.innerHTML = '';

    const challenge = appState.user.onboardingAnswers.challenge || 'default';
    const pool = [...(INSIGHTS_MAP[challenge] || []), ...INSIGHTS_MAP.default];
    // Show 2 relevant tips
    pool.slice(0, 2).forEach(ins => {
        const row = document.createElement('div');
        row.className = 'insight-row';
        row.innerHTML = `<span class="ins-icon">${ins.icon}</span><span>${ins.text}</span>`;
        container.appendChild(row);
    });
}
