// Living Earth App State Management
let appState = {
    user: {
        name: 'Parth Patidar',
        xp: 35,
        level: 1,
        rank: 'Seed',
        streak: 2
    },
    forest: {
        trees: [
            { x: 50, y: 150, type: 'oak', scale: 0.8 },
            { x: 120, y: 140, type: 'pine', scale: 0.9 }
        ],
        flowers: [
            { x: 80, y: 170, color: '#F9A825' }
        ],
        birds: [],
        riverHealth: 'clear' // clear, sparkling
    },
    dailyLogs: [],
    challenges: [
        { id: 'ch-1', title: 'Meatless Day', desc: 'Eat vegetarian or vegan meals for a full day', xp: 30, progress: 0, target: 1, completed: false },
        { id: 'ch-2', title: 'Pedal Power', desc: 'Bike or walk instead of driving', xp: 45, progress: 0, target: 1, completed: false },
        { id: 'ch-3', title: 'Vampire Unplug', desc: 'Unplug all idle electronics tonight', xp: 20, progress: 0, target: 1, completed: false }
    ],
    badges: [
        { id: 'badge-1', name: 'First Sprout', desc: 'Complete first daily log entry', icon: 'sprout', unlocked: false },
        { id: 'badge-2', name: 'Carbon Shredder', desc: 'Log active transit 2 times', icon: 'bike', unlocked: false },
        { id: 'badge-3', name: 'Forest Ally', desc: 'Reach Level 3 (Plant Status)', icon: 'trees', unlocked: false },
        { id: 'badge-4', name: 'Green Chef', desc: 'Log vegan meals 3 times', icon: 'beef', unlocked: false }
    ]
};

// Conversational quick log steps
const CONVO_STEPS = {
    1: {
        question: "🌱 Hello! How did you commute today?",
        options: [
            { text: "🚶 Walked / Cycled", value: "active", co2Offset: 5.2 },
            { text: "🚌 Public Transit", value: "transit", co2Offset: 2.8 },
            { text: "🚗 Drove alone", value: "car", co2Offset: -4.0 }
        ]
    },
    2: {
        question: "🥗 Wonderful. What did your meals look like today?",
        options: [
            { text: "🥦 Plant Based (Vegan)", value: "vegan", co2Offset: 4.5 },
            { text: "🥚 Vegetarian", value: "vege", co2Offset: 2.5 },
            { text: "🥩 Mixed (Meat & Dairy)", value: "mixed", co2Offset: 0.5 },
            { text: "🍔 Heavy Meat Eater", value: "heavy", co2Offset: -3.0 }
        ]
    },
    3: {
        question: "⚡ Almost done! Select any green actions you completed today:",
        options: [
            { text: "💡 Unplugged idle lights/devices", value: "power", co2Offset: 1.5 },
            { text: "🚿 Took a short shower (<5 min)", value: "water", co2Offset: 1.2 },
            { text: "🛍️ Avoided single-use plastics", value: "plastic", co2Offset: 0.8 },
            { text: "✨ None of the above", value: "none", co2Offset: 0.0 }
        ],
        multiSelect: true
    }
};

let currentConvoStep = 1;
let currentConvoLog = {
    transit: null,
    diet: null,
    actions: []
};

// Community members data
const COMMUNITY_USERS = [
    { name: 'Aarav Sharma', rank: 'Forest Guardian', trees: 14, icon: 'A' },
    { name: 'Diya Patel', rank: 'Tree status', trees: 7, icon: 'D' },
    { name: 'Karan Mehta', rank: 'Sprout status', trees: 3, icon: 'K' }
];

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    renderForest();
    renderChallenges();
    renderAchievements();
    renderConvoStep();
    renderCommunity();
    renderAIInsights();
    updateUserLevelUI();
    lucide.createIcons();
});

// Load and Save states
function loadState() {
    const saved = localStorage.getItem('living_earth_state');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            appState.user = { ...appState.user, ...parsed.user };
            appState.forest = { ...appState.forest, ...parsed.forest };
            appState.dailyLogs = parsed.dailyLogs || [];
            
            if (parsed.challenges) {
                appState.challenges.forEach(ch => {
                    const savedCh = parsed.challenges.find(c => c.id === ch.id);
                    if (savedCh) {
                        ch.progress = savedCh.progress;
                        ch.completed = savedCh.completed;
                    }
                });
            }

            if (parsed.badges) {
                appState.badges.forEach(b => {
                    const savedB = parsed.badges.find(s => s.id === b.id);
                    if (savedB) b.unlocked = savedB.unlocked;
                });
            }
        } catch (e) {
            console.error('Error loading state', e);
        }
    }
}

function saveState() {
    localStorage.setItem('living_earth_state', JSON.stringify(appState));
}

// Router SPA view transition
function enterApp() {
    document.getElementById('landing-view').style.display = 'none';
    document.getElementById('app-view').style.display = 'grid';
    document.getElementById('bottom-nav').style.display = 'flex';
    document.getElementById('btn-enter-app').style.display = 'none';
    
    // Auto-scroll to view nicely
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchTab(tab, element) {
    document.querySelectorAll('.bottom-nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    // Scroll to respective cards inside single dashboard view
    const trackerCard = document.getElementById('tracker-card');
    if (tab === 'tracker') {
        trackerCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Render dynamic forest SVGs (Oak, Pine, Flowers, River, Birds)
function renderForest() {
    const svg = document.getElementById('dynamic-forest-svg');
    if (!svg) return;
    
    // Clean old dynamic assets
    svg.innerHTML = '';

    // Draw Hills Back background
    // Draw Dynamic Trees
    appState.forest.trees.forEach(tree => {
        let treeMarkup = '';
        if (tree.type === 'pine') {
            treeMarkup = `
                <g transform="translate(${tree.x}, ${tree.y}) scale(${tree.scale})">
                    <rect x="-4" y="0" width="8" height="20" fill="var(--earth-brown)" />
                    <polygon points="0,-35 -20,-10 20,-10" fill="var(--forest-dark)" />
                    <polygon points="0,-45 -15,-20 15,-20" fill="var(--primary-forest)" />
                    <polygon points="0,-55 -10,-30 10,-30" fill="var(--sage)" />
                </g>
            `;
        } else {
            // Oak tree
            treeMarkup = `
                <g transform="translate(${tree.x}, ${tree.y}) scale(${tree.scale})">
                    <rect x="-5" y="0" width="10" height="25" fill="var(--earth-brown)" />
                    <circle cx="0" cy="-20" r="18" fill="var(--primary-forest)" />
                    <circle cx="-10" cy="-25" r="14" fill="var(--leaf-green)" />
                    <circle cx="10" cy="-25" r="12" fill="var(--moss-green)" />
                </g>
            `;
        }
        svg.insertAdjacentHTML('beforeend', treeMarkup);
    });

    // Draw Flowers
    appState.forest.flowers.forEach(flower => {
        const flowerMarkup = `
            <g transform="translate(${flower.x}, ${flower.y})">
                <circle cx="0" cy="0" r="3" fill="${flower.color}" />
                <circle cx="-3" cy="0" r="2" fill="#FFFFFF" />
                <circle cx="3" cy="0" r="2" fill="#FFFFFF" />
                <circle cx="0" cy="-3" r="2" fill="#FFFFFF" />
                <circle cx="0" cy="3" r="2" fill="#FFFFFF" />
            </g>
        `;
        svg.insertAdjacentHTML('beforeend', flowerMarkup);
    });

    // Draw birds if any
    appState.forest.birds.forEach(bird => {
        const birdMarkup = `
            <path d="M ${bird.x} ${bird.y} Q ${bird.x+5} ${bird.y-5} ${bird.x+10} ${bird.y} Q ${bird.x+15} ${bird.y-5} ${bird.x+20} ${bird.y}" 
                  fill="none" stroke="var(--forest-dark)" stroke-width="2" />
        `;
        svg.insertAdjacentHTML('beforeend', birdMarkup);
    });
}

// Render Conversational quick logger
function renderConvoStep() {
    const container = document.getElementById('chat-options-container');
    const questionBubble = document.getElementById('coach-question');
    
    if (!container || !questionBubble) return;

    const step = CONVO_STEPS[currentConvoStep];
    questionBubble.textContent = step.question;
    container.innerHTML = '';

    step.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt.text;
        
        btn.addEventListener('click', () => {
            selectOption(opt);
        });
        container.appendChild(btn);
    });
}

function selectOption(option) {
    if (currentConvoStep === 1) {
        currentConvoLog.transit = option;
        currentConvoStep = 2;
        renderConvoStep();
    } else if (currentConvoStep === 2) {
        currentConvoLog.diet = option;
        currentConvoStep = 3;
        renderConvoStep();
    } else if (currentConvoStep === 3) {
        if (option.value !== 'none') {
            currentConvoLog.actions.push(option);
        }
        
        // Finalize Conversational log
        completeConvoLog();
    }
}

function completeConvoLog() {
    // Calculate total daily score
    let offsetScore = 0;
    if (currentConvoLog.transit) offsetScore += currentConvoLog.transit.co2Offset;
    if (currentConvoLog.diet) offsetScore += currentConvoLog.diet.co2Offset;
    
    currentConvoLog.actions.forEach(act => {
        offsetScore += act.co2Offset;
    });

    // Add elements to digital forest
    if (offsetScore > 5) {
        // Add random oak tree
        const newX = 180 + Math.random() * 150;
        const newY = 130 + Math.random() * 30;
        appState.forest.trees.push({
            x: Math.round(newX),
            y: Math.round(newY),
            type: Math.random() > 0.5 ? 'oak' : 'pine',
            scale: parseFloat((0.7 + Math.random() * 0.4).toFixed(2))
        });
        
        // Add a flower
        appState.forest.flowers.push({
            x: Math.round(50 + Math.random() * 300),
            y: Math.round(155 + Math.random() * 20),
            color: ['#F9A825', '#EF5350', '#EC407A', '#AB47BC'][Math.floor(Math.random() * 4)]
        });
    }

    if (offsetScore > 8) {
        // Add a bird
        appState.forest.birds.push({
            x: Math.round(40 + Math.random() * 150),
            y: Math.round(30 + Math.random() * 40)
        });
    }

    // Gain XP
    gainXP(30);

    // Update challenge progress
    if (currentConvoLog.transit && currentConvoLog.transit.value === 'active') {
        incrementChallenge('ch-2');
        
        const activeCount = appState.dailyLogs.filter(l => l.transit === 'active').length + 1;
        if (activeCount >= 2) unlockBadge('badge-2');
    }
    if (currentConvoLog.diet && currentConvoLog.diet.value === 'vegan') {
        incrementChallenge('ch-1');
        
        const veganCount = appState.dailyLogs.filter(l => l.diet === 'vegan').length + 1;
        if (veganCount >= 3) unlockBadge('badge-4');
    }
    
    // Save entry
    appState.dailyLogs.push({
        date: new Date().toISOString().split('T')[0],
        transit: currentConvoLog.transit ? currentConvoLog.transit.value : 'none',
        diet: currentConvoLog.diet ? currentConvoLog.diet.value : 'none',
        score: offsetScore
    });

    unlockBadge('badge-1');

    // Reset Chat to Step 1
    currentConvoStep = 1;
    currentConvoLog = { transit: null, diet: null, actions: [] };
    
    saveState();
    renderForest();
    renderConvoStep();
    renderAIInsights();
    renderChallenges();
    renderAchievements();
    updateUserLevelUI();
}

// Gamification mechanics
function gainXP(amount) {
    appState.user.xp += amount;
    const threshold = appState.user.level * 100;
    if (appState.user.xp >= threshold) {
        appState.user.xp -= threshold;
        appState.user.level += 1;
        
        // Ranks: Seed, Sprout, Plant, Tree, Forest Guardian, Earth Champion
        const ranks = ['Seed', 'Sprout', 'Plant', 'Tree', 'Forest Guardian', 'Earth Champion'];
        appState.user.rank = ranks[Math.min(ranks.length - 1, appState.user.level - 1)];

        if (appState.user.level >= 3) {
            unlockBadge('badge-3');
        }
    }
}

function unlockBadge(id) {
    const badge = appState.badges.find(b => b.id === id);
    if (badge && !badge.unlocked) {
        badge.unlocked = true;
        gainXP(50);
    }
}

function incrementChallenge(id) {
    const ch = appState.challenges.find(c => c.id === id);
    if (ch && !ch.completed) {
        ch.progress += 1;
        if (ch.progress >= ch.target) {
            ch.completed = true;
            ch.progress = ch.target;
            gainXP(ch.xp);
        }
    }
}

function updateUserLevelUI() {
    document.getElementById('lbl-level').textContent = appState.user.level;
    document.getElementById('lbl-rank').textContent = appState.user.rank;
    document.getElementById('lbl-xp').textContent = appState.user.xp;
    
    const nextXP = appState.user.level * 100;
    document.getElementById('lbl-next-xp').textContent = nextXP;
    
    const pct = Math.round((appState.user.xp / nextXP) * 100);
    document.getElementById('progress-bar-fill').style.width = `${pct}%`;
    document.getElementById('forest-eco-score').textContent = appState.user.rank;
}

// Render eco challenges
function renderChallenges() {
    const container = document.getElementById('challenges-list');
    if (!container) return;

    container.innerHTML = '';
    appState.challenges.forEach(ch => {
        const div = document.createElement('div');
        div.style.padding = '1rem';
        div.style.background = 'var(--bg-earth)';
        div.style.borderRadius = '16px';
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';

        div.innerHTML = `
            <div>
                <strong style="display: block; font-family: var(--font-heading); color: var(--forest-dark);">${ch.title}</strong>
                <span style="font-size: 0.8rem; color: var(--text-secondary);">${ch.desc}</span>
            </div>
            ${ch.completed ? `
                <span style="color: var(--leaf-green); font-weight: 700; font-size: 0.85rem;">✓ Done</span>
            ` : `
                <button class="btn-nav-action" style="padding: 0.4rem 1rem; font-size: 0.8rem;" onclick="triggerChallenge('${ch.id}')">+${ch.xp} XP</button>
            `}
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

// Render nature badges
function renderAchievements() {
    const container = document.getElementById('achievements-grid');
    if (!container) return;

    container.innerHTML = '';
    appState.badges.forEach(badge => {
        let lucideIcon = 'sprout';
        if (badge.icon === 'bike') lucideIcon = 'bike';
        if (badge.icon === 'trees') lucideIcon = 'trees';
        if (badge.icon === 'beef') lucideIcon = 'beef';

        const div = document.createElement('div');
        div.className = `badge-leaf ${badge.unlocked ? 'unlocked' : ''}`;
        div.innerHTML = `
            <div class="badge-leaf-icon">
                <i data-lucide="${lucideIcon}"></i>
            </div>
            <span>${badge.name}</span>
        `;
        container.appendChild(div);
    });
    lucide.createIcons();
}

// Render community list
function renderCommunity() {
    const container = document.getElementById('community-users');
    if (!container) return;

    container.innerHTML = '';
    COMMUNITY_USERS.forEach(user => {
        const div = document.createElement('div');
        div.className = 'user-row';
        div.innerHTML = `
            <div class="user-details">
                <div class="user-avatar">${user.icon}</div>
                <div>
                    <strong style="display: block; font-size: 0.9rem;">${user.name}</strong>
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">${user.rank}</span>
                </div>
            </div>
            <span style="font-weight: 700; color: var(--primary-forest); font-size: 0.85rem;">🌲 ${user.trees} Trees</span>
        `;
        container.appendChild(div);
    });
}

// Render Sustainability coach AI Insights
function renderAIInsights() {
    const container = document.getElementById('ai-insights-block');
    if (!container) return;

    container.innerHTML = '';
    
    // Encouraging messages
    const insights = [
        "🌲 Walking/biking prevents carbon pollution while building strong cardiorespiratory fitness.",
        "🥦 Adding plant-based days to your diet saves up to 4kg of CO2 per meal and preserves clean water.",
        "💡 Unplugging devices prevents vampire energy draw, saving power for local grids."
    ];

    insights.forEach(ins => {
        const p = document.createElement('p');
        p.textContent = ins;
        container.appendChild(p);
    });
}
