// EcoTrace App State Management
let appState = {
    theme: 'dark',
    user: {
        name: 'Parth Patidar',
        xp: 0,
        level: 1,
        streak: 0,
        lastLogDate: null
    },
    calculator: {
        completed: false,
        transport: 0,
        energy: 0,
        food: 0,
        waste: 0,
        total: 0 // In tonnes
    },
    dailyLogs: [],
    challenges: [
        { id: 'ch-1', title: 'Meatless Day', desc: 'Eat vegetarian or vegan meals for a full day', xp: 30, progress: 0, target: 1, completed: false, category: 'food' },
        { id: 'ch-2', title: 'Pedal Power', desc: 'Bike or walk instead of driving for any daily trip', xp: 40, progress: 0, target: 1, completed: false, category: 'transport' },
        { id: 'ch-3', title: 'Power Down', desc: 'Unplug all idle appliances before going to sleep', xp: 20, progress: 0, target: 1, completed: false, category: 'energy' },
        { id: 'ch-4', title: 'Zero Waste Challenge', desc: 'Avoid single-use plastics for 3 days in a row', xp: 50, progress: 0, target: 3, completed: false, category: 'waste' }
    ],
    badges: [
        { id: 'badge-1', name: 'First Steps', desc: 'Complete the initial footprint calculator', icon: 'compass', unlocked: false },
        { id: 'badge-2', name: 'Eco Starter', desc: 'Log your first daily activity entry', icon: 'calendar', unlocked: false },
        { id: 'badge-3', name: 'Green Gourmet', desc: 'Log 3 vegan or vegetarian meals', icon: 'beef', unlocked: false },
        { id: 'badge-4', name: 'Clean Commuter', desc: 'Log active transit (walking/cycling) 3 times', icon: 'bike', unlocked: false },
        { id: 'badge-5', name: 'Carbon Conqueror', desc: 'Complete 3 eco challenges', icon: 'award', unlocked: false }
    ]
};

// Factors for CO2 Calculation (kg CO2e per unit per year)
const FACTORS = {
    vehicle: {
        'none': 0,
        'petrol-small': 0.15, // per km
        'petrol-medium': 0.20, // per km
        'petrol-large': 0.28, // per km
        'diesel': 0.19, // per km
        'hybrid': 0.10, // per km
        'ev': 0.05 // per km
    },
    transitHour: 0.09 * 50, // per hr weekly -> annual (~50km/hr * 0.04kg/km * 50 weeks)
    flightHour: 90, // per hour of flight
    electricityBillDollar: 105, // annual kg per dollar of monthly bill
    heating: {
        'gas': 1200,
        'electricity': 800,
        'oil': 1800,
        'none': 0
    },
    diet: {
        'heavy-meat': 2500,
        'medium-meat': 1700,
        'low-meat': 1200,
        'vegetarian': 900,
        'vegan': 600
    },
    waste: {
        'high': 500,
        'medium': 300,
        'low': 100
    }
};

let distributionChart = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadStateFromLocalStorage();
    initTheme();
    initNavigation();
    initCalculator();
    initDailyLog();
    initChallenges();
    updateUI();
    lucide.createIcons();
});

// Load state
function loadStateFromLocalStorage() {
    const saved = localStorage.getItem('ecotrace_state');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Merge loaded state with defaults
            appState.theme = parsed.theme || appState.theme;
            appState.user = { ...appState.user, ...parsed.user };
            appState.calculator = { ...appState.calculator, ...parsed.calculator };
            appState.dailyLogs = parsed.dailyLogs || [];
            
            // Maintain static challenge list but merge progress
            if (parsed.challenges) {
                appState.challenges.forEach(ch => {
                    const savedCh = parsed.challenges.find(c => c.id === ch.id);
                    if (savedCh) {
                        ch.progress = savedCh.progress;
                        ch.completed = savedCh.completed;
                    }
                });
            }
            
            // Merge badge unlock status
            if (parsed.badges) {
                appState.badges.forEach(b => {
                    const savedB = parsed.badges.find(s => s.id === b.id);
                    if (savedB) b.unlocked = savedB.unlocked;
                });
            }
        } catch (e) {
            console.error('Error parsing local storage', e);
        }
    }
}

function saveStateToLocalStorage() {
    localStorage.setItem('ecotrace_state', JSON.stringify(appState));
}

// Navigation UI
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const pageHeading = document.getElementById('page-heading');
    const pageSubheading = document.getElementById('page-subheading');

    const subheadings = {
        'dashboard': 'Real-time footprint insights and analytics',
        'calculator': 'Detailed yearly emission estimator',
        'tracker': 'Log your daily actions to reduce footprint',
        'challenges': 'Earn XP and develop green habits',
        'profile': 'View your level, rewards, and achievements'
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            
            // Update Active Link
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show active section
            sections.forEach(sec => {
                if (sec.id === `sec-${targetId}`) {
                    sec.classList.add('active');
                } else {
                    sec.classList.remove('active');
                }
            });

            // Update headings
            pageHeading.textContent = item.querySelector('span').textContent;
            pageSubheading.textContent = subheadings[targetId] || '';

            // Handle section specific rendering
            if (targetId === 'dashboard') {
                renderCharts();
            } else if (targetId === 'profile') {
                renderProfile();
            }
        });
    });
}

// Theme Management
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    
    // Apply initial theme classes
    if (appState.theme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    }

    themeBtn.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            appState.theme = 'light';
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            appState.theme = 'dark';
        }
        saveStateToLocalStorage();
        if (distributionChart) {
            renderCharts(); // Redraw chart for theme variables change
        }
    });
}

// Multi-step Calculator Form
function initCalculator() {
    const steps = document.querySelectorAll('.form-step');
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');
    const btnSubmit = document.getElementById('btn-submit');
    const form = document.getElementById('footprint-form');
    const rangeCleanEnergy = document.getElementById('calc-clean-energy');
    const valCleanEnergy = document.getElementById('clean-energy-val');

    let currentStep = 1;

    // Range input listener
    rangeCleanEnergy.addEventListener('input', (e) => {
        valCleanEnergy.textContent = e.target.value;
    });

    btnNext.addEventListener('click', () => {
        if (currentStep < steps.length) {
            steps[currentStep - 1].classList.remove('active');
            currentStep++;
            steps[currentStep - 1].classList.add('active');
            updateButtons();
        }
    });

    btnPrev.addEventListener('click', () => {
        if (currentStep > 1) {
            steps[currentStep - 1].classList.remove('active');
            currentStep--;
            steps[currentStep - 1].classList.add('active');
            updateButtons();
        }
    });

    function updateButtons() {
        btnPrev.disabled = currentStep === 1;
        if (currentStep === steps.length) {
            btnNext.style.display = 'none';
            btnSubmit.style.display = 'inline-flex';
        } else {
            btnNext.style.display = 'inline-flex';
            btnSubmit.style.display = 'none';
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Retrieve inputs
        const vehicleType = document.getElementById('calc-vehicle-type').value;
        const carDistance = parseFloat(document.getElementById('calc-car-distance').value) || 0;
        const transitHours = parseFloat(document.getElementById('calc-public-transit').value) || 0;
        const flights = parseFloat(document.getElementById('calc-flights').value) || 0;

        const electricity = parseFloat(document.getElementById('calc-electricity').value) || 0;
        const cleanPct = parseFloat(rangeCleanEnergy.value) || 0;
        const heatingFuel = document.getElementById('calc-heating-fuel').value;

        const diet = document.getElementById('calc-diet').value;
        const localFood = document.getElementById('calc-local-food').value;

        const waste = document.getElementById('calc-waste').value;
        const recyclePaper = document.getElementById('calc-recycle-paper').checked;
        const recyclePlastic = document.getElementById('calc-recycle-plastic').checked;
        const recycleGlass = document.getElementById('calc-recycle-glass').checked;

        // Perform carbon calculations
        // 1. Transport
        let transportVal = (carDistance * FACTORS.vehicle[vehicleType]) +
                           (transitHours * FACTORS.transitHour) +
                           (flights * FACTORS.flightHour);
        
        // 2. Home Energy
        let baseElectricity = electricity * FACTORS.electricityBillDollar;
        let electricityVal = baseElectricity * (1 - (cleanPct / 100));
        let heatingVal = FACTORS.heating[heatingFuel];
        let energyVal = electricityVal + heatingVal;

        // 3. Diet
        let dietVal = FACTORS.diet[diet];
        if (localFood === 'always') dietVal *= 0.9;
        if (localFood === 'sometimes') dietVal *= 0.95;

        // 4. Waste
        let wasteVal = FACTORS.waste[waste];
        let recyclingDiscount = 0;
        if (recyclePaper) recyclingDiscount += 0.05;
        if (recyclePlastic) recyclingDiscount += 0.05;
        if (recycleGlass) recyclingDiscount += 0.05;
        wasteVal *= (1 - recyclingDiscount);

        // Update state
        appState.calculator.transport = Math.round(transportVal);
        appState.calculator.energy = Math.round(energyVal);
        appState.calculator.food = Math.round(dietVal);
        appState.calculator.waste = Math.round(wasteVal);
        appState.calculator.total = parseFloat(((transportVal + energyVal + dietVal + wasteVal) / 1000).toFixed(2));
        appState.calculator.completed = true;

        // Give XP for completing calculator
        if (!appState.badges[0].unlocked) {
            gainXP(100);
            unlockBadge('badge-1');
        }

        saveStateToLocalStorage();
        updateUI();

        // Direct user back to dashboard
        document.getElementById('nav-dashboard').click();
    });
}

// Daily Logs Tracker
function initDailyLog() {
    const form = document.getElementById('daily-log-form');
    const logDateInput = document.getElementById('log-date');
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    logDateInput.value = today;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const date = logDateInput.value;
        const distance = parseFloat(document.getElementById('log-transit-dist').value) || 0;
        const mode = document.getElementById('log-transit-mode').value;
        const dietVal = document.getElementById('log-diet').value;
        
        const lightsSaved = document.getElementById('log-save-lights').checked;
        const showerSaved = document.getElementById('log-save-short-shower').checked;
        const plasticSaved = document.getElementById('log-save-no-plastic').checked;

        // Daily standard target is roughly 12 kg CO2. Let's calculate actual today:
        let dailyTransport = 0;
        if (mode === 'car-petrol') dailyTransport = distance * FACTORS.vehicle['petrol-medium'];
        if (mode === 'car-ev') dailyTransport = distance * FACTORS.vehicle['ev'];
        if (mode === 'transit') dailyTransport = distance * 0.04; // average bus/train factor

        let dailyFood = FACTORS.diet[dietVal] / 365;

        // Savings offsets
        let dailySavings = 0;
        if (lightsSaved) dailySavings += 1.5;
        if (showerSaved) dailySavings += 1.0;
        if (plasticSaved) dailySavings += 0.8;

        const totalCO2Today = parseFloat((dailyTransport + dailyFood - dailySavings).toFixed(2));

        const logEntry = {
            id: 'log-' + Date.now(),
            date,
            distance,
            mode,
            diet: dietVal,
            savings: dailySavings,
            co2: totalCO2Today
        };

        appState.dailyLogs.unshift(logEntry);

        // Daily streak calculation
        updateStreak(date);

        // Gamification XP
        gainXP(25);
        
        // Unlock badge check
        unlockBadge('badge-2');
        
        // Count diet status
        const veganVegeLogs = appState.dailyLogs.filter(l => l.diet === 'vegan' || l.diet === 'vegetarian').length;
        if (veganVegeLogs >= 3) {
            unlockBadge('badge-3');
        }

        // Count active transit
        const activeTransitLogs = appState.dailyLogs.filter(l => l.mode === 'active').length;
        if (activeTransitLogs >= 3) {
            unlockBadge('badge-4');
        }

        // Update active challenges progress
        if (dietVal === 'vegan' || dietVal === 'vegetarian') {
            incrementChallengeProgress('ch-1');
        }
        if (mode === 'active') {
            incrementChallengeProgress('ch-2');
        }
        if (lightsSaved) {
            incrementChallengeProgress('ch-3');
        }
        if (plasticSaved) {
            incrementChallengeProgress('ch-4');
        }

        saveStateToLocalStorage();
        updateUI();

        // Reset inputs
        document.getElementById('log-transit-dist').value = 0;
        document.getElementById('log-save-lights').checked = false;
        document.getElementById('log-save-short-shower').checked = false;
        document.getElementById('log-save-no-plastic').checked = false;
    });
}

function updateStreak(logDate) {
    if (!appState.user.lastLogDate) {
        appState.user.streak = 1;
    } else {
        const last = new Date(appState.user.lastLogDate);
        const current = new Date(logDate);
        const diffTime = Math.abs(current - last);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            appState.user.streak += 1;
        } else if (diffDays > 1) {
            appState.user.streak = 1;
        }
    }
    appState.user.lastLogDate = logDate;
}

// Challenges / Eco Actions
function initChallenges() {
    renderChallenges();
}

function renderChallenges() {
    const container = document.getElementById('challenges-container');
    container.innerHTML = '';

    appState.challenges.forEach(ch => {
        const card = document.createElement('div');
        card.className = `glass-card challenge-card ${ch.completed ? 'completed' : ''}`;
        
        const pct = Math.min(100, Math.round((ch.progress / ch.target) * 100));

        let iconName = 'sparkles';
        if (ch.category === 'food') iconName = 'beef';
        if (ch.category === 'transport') iconName = 'bike';
        if (ch.category === 'energy') iconName = 'zap';
        if (ch.category === 'waste') iconName = 'trash-2';

        card.innerHTML = `
            <div class="challenge-icon-group">
                <div class="challenge-icon-wrapper">
                    <i data-lucide="${iconName}"></i>
                </div>
                <span class="challenge-xp">+${ch.xp} XP</span>
            </div>
            <h3 class="challenge-title">${ch.title}</h3>
            <p class="challenge-desc">${ch.desc}</p>
            <div class="challenge-actions">
                ${ch.completed ? `
                    <span class="challenge-completed-badge">
                        <i data-lucide="check-circle-2"></i> Completed
                    </span>
                ` : `
                    <div class="challenge-progress-bar">
                        <div class="challenge-progress-fill" style="width: ${pct}%"></div>
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="quickCompleteChallenge('${ch.id}')">Log Action</button>
                `}
            </div>
        `;
        container.appendChild(card);
    });
    lucide.createIcons();
}

window.quickCompleteChallenge = function(id) {
    incrementChallengeProgress(id);
    saveStateToLocalStorage();
    updateUI();
};

function incrementChallengeProgress(id) {
    const ch = appState.challenges.find(c => c.id === id);
    if (ch && !ch.completed) {
        ch.progress += 1;
        if (ch.progress >= ch.target) {
            ch.completed = true;
            ch.progress = ch.target;
            gainXP(ch.xp);

            // Audit Challenge Badge count
            const completedCount = appState.challenges.filter(c => c.completed).length;
            if (completedCount >= 3) {
                unlockBadge('badge-5');
            }
        }
        renderChallenges();
    }
}

// Gamification mechanics
function gainXP(amount) {
    appState.user.xp += amount;
    // Level Up Formula
    const nextLevelXP = appState.user.level * 100;
    if (appState.user.xp >= nextLevelXP) {
        appState.user.xp -= nextLevelXP;
        appState.user.level += 1;
    }
}

function unlockBadge(id) {
    const badge = appState.badges.find(b => b.id === id);
    if (badge && !badge.unlocked) {
        badge.unlocked = true;
        gainXP(50); // bonus XP
    }
}

// UI Refresh Updates
function updateUI() {
    // Top sidebar / streak values
    document.getElementById('quick-name').textContent = appState.user.name;
    document.getElementById('quick-level-val').textContent = appState.user.level;
    document.getElementById('current-level').textContent = appState.user.level;
    document.getElementById('current-xp').textContent = appState.user.xp;
    
    const xpNeeded = appState.user.level * 100;
    document.getElementById('next-level-xp').textContent = xpNeeded;
    document.getElementById('xp-fill-width').style.width = `${(appState.user.xp / xpNeeded) * 100}%`;
    document.getElementById('streak-count').textContent = appState.user.streak;

    // Ranks based on level
    const ranks = ['Seedling', 'Sapling', 'Green Citizen', 'Eco Advocate', 'Climate Hero', 'Earth Guardian'];
    const rankIndex = Math.min(ranks.length - 1, Math.floor((appState.user.level - 1) / 2));
    document.getElementById('rank-name').textContent = ranks[rankIndex];

    // Stats values on dashboard
    document.getElementById('stat-transport').textContent = appState.calculator.transport;
    document.getElementById('stat-energy').textContent = appState.calculator.energy;
    document.getElementById('stat-food').textContent = appState.calculator.food;
    document.getElementById('stat-waste').textContent = appState.calculator.waste;
    document.getElementById('total-footprint-val').textContent = appState.calculator.total.toFixed(1);

    // Radial gauge color fill calculation
    // Average global footprint per capita is ~4.5 tonnes, USA is ~14.5 tonnes. Let's make target ideal 3.0 tonnes.
    const maxVal = 15;
    const progressDeg = Math.min(360, (appState.calculator.total / maxVal) * 360);
    const gauge = document.getElementById('gauge-progress');
    
    let color = 'var(--accent-green)';
    if (appState.calculator.total > 4.5) color = 'var(--accent-orange)';
    if (appState.calculator.total > 9.0) color = 'var(--accent-red)';
    
    gauge.style.background = `conic-gradient(${color} ${progressDeg}deg, var(--border) 0deg)`;

    // Comparison text
    const comparisonText = document.getElementById('comparison-text');
    if (!appState.calculator.completed) {
        comparisonText.textContent = "Please fill out the annual calculator to see analysis.";
    } else {
        const avgGlobal = 4.5;
        const diff = Math.abs(appState.calculator.total - avgGlobal);
        const diffPct = Math.round((diff / avgGlobal) * 100);
        if (appState.calculator.total > avgGlobal) {
            comparisonText.innerHTML = `Your footprint is <strong>${diffPct}% higher</strong> than the global average (4.5 tonnes/yr).`;
        } else {
            comparisonText.innerHTML = `Awesome! Your footprint is <strong>${diffPct}% lower</strong> than the global average (4.5 tonnes/yr).`;
        }
    }

    renderCharts();
    renderInsights();
    renderDailyHistory();
    renderChallenges();
}

// Render dynamic AI insights
function renderInsights() {
    const container = document.getElementById('insights-container');
    if (!appState.calculator.completed) {
        container.innerHTML = `<p class="placeholder-text">Please complete the initial Carbon Footprint Calculator to generate custom insights.</p>`;
        return;
    }

    container.innerHTML = '';
    const insights = [];

    // Sort categories to find largest contributor
    const cats = [
        { name: 'Transport', val: appState.calculator.transport, icon: 'car' },
        { name: 'Home Energy', val: appState.calculator.energy, icon: 'zap' },
        { name: 'Diet & Food', val: appState.calculator.food, icon: 'beef' },
        { name: 'Waste', val: appState.calculator.waste, icon: 'trash-2' }
    ];
    cats.sort((a, b) => b.val - a.val);

    // Primary contributor advice
    const top = cats[0];
    if (top.name === 'Transport' && top.val > 2000) {
        insights.push({
            title: 'Transition your Commute',
            text: 'Your transport emissions are high. Switching just two commutes a week to public transit or cycling can save over 500kg of CO2 per year.',
            icon: 'car'
        });
    } else if (top.name === 'Home Energy' && top.val > 1500) {
        insights.push({
            title: 'Clean Energy Transition',
            text: 'Home energy represents your biggest carbon source. Increasing your renewable energy mix or insulating doors/windows can reduce energy loss by 20%.',
            icon: 'zap'
        });
    } else if (top.name === 'Diet & Food' && top.val > 1200) {
        insights.push({
            title: 'Sustainable Nutrition',
            text: 'Animal products carry high emissions. Adopting a plant-focused diet for 3 days a week can drop your food carbon impact by 35%.',
            icon: 'beef'
        });
    } else if (top.name === 'Waste' && top.val > 300) {
        insights.push({
            title: 'Circular Waste System',
            text: 'Active recycling and composting cuts methane release. Prioritize glass and cardboard recycling to unlock maximum reductions.',
            icon: 'trash-2'
        });
    }

    // Generic helpful suggestions
    insights.push({
        title: 'Vampire Draw Prevention',
        text: 'Electronics consume up to 10% of household electricity in standby mode. Smart power strips or unplugging devices saves easy carbon.',
        icon: 'plug'
    });

    insights.push({
        title: 'Local Sourcing',
        text: 'Food mileage increases carbon costs. Buying locally grown produce reduces transportation logistics impact by up to 15%.',
        icon: 'map-pin'
    });

    insights.forEach(ins => {
        const div = document.createElement('div');
        div.className = 'insight-item';
        div.innerHTML = `
            <i data-lucide="${ins.icon}" class="insight-item-icon"></i>
            <div class="insight-item-text">
                <strong>${ins.title}</strong>
                <span>${ins.text}</span>
            </div>
        `;
        container.appendChild(div);
    });
    lucide.createIcons();
}

// Render Daily Log History List
function renderDailyHistory() {
    const container = document.getElementById('history-container');
    if (appState.dailyLogs.length === 0) {
        container.innerHTML = `<div class="no-logs">No daily entries logged yet.</div>`;
        return;
    }

    container.innerHTML = '';
    appState.dailyLogs.forEach(log => {
        const dateObj = new Date(log.date);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const displayDate = dateObj.toLocaleDateString('en-US', options);

        let details = [];
        if (log.distance > 0) details.push(`${log.distance}km via ${log.mode.replace('car-', '')}`);
        details.push(`${log.diet} meals`);

        const div = document.createElement('div');
        div.className = 'log-item';
        div.innerHTML = `
            <div class="log-item-left">
                <span class="log-item-date">${displayDate}</span>
                <span class="log-item-summary">${details.join(', ')}</span>
                ${log.savings > 0 ? `<span class="log-item-saving">Saved ${log.savings.toFixed(1)} kg CO₂e</span>` : ''}
            </div>
            <div class="log-item-right">
                <span class="log-item-co2">${log.co2} kg CO₂</span>
                <button class="log-item-delete" onclick="deleteLogEntry('${log.id}')">Delete</button>
            </div>
        `;
        container.appendChild(div);
    });
}

window.deleteLogEntry = function(id) {
    appState.dailyLogs = appState.dailyLogs.filter(l => l.id !== id);
    saveStateToLocalStorage();
    updateUI();
};

// Render Charts with Chart.js
function renderCharts() {
    const ctx = document.getElementById('distributionChart');
    if (!ctx) return;

    if (distributionChart) {
        distributionChart.destroy();
    }

    const data = [
        appState.calculator.transport,
        appState.calculator.energy,
        appState.calculator.food,
        appState.calculator.waste
    ];

    const isDark = document.body.classList.contains('dark-theme');
    const labelColor = isDark ? '#f3f4f6' : '#1f2937';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

    distributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Transport', 'Home Energy', 'Diet & Food', 'Waste'],
            datasets: [{
                data: data,
                backgroundColor: [
                    '#06b6d4', // Transport
                    '#f59e0b', // Energy
                    '#10b981', // Food
                    '#8b5cf6'  // Waste
                ],
                borderWidth: isDark ? 2 : 1,
                borderColor: isDark ? '#161c2d' : '#ffffff',
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Using our custom styled legend
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.raw + ' kg CO₂e';
                            return label;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Profile Page rendering
function renderProfile() {
    document.getElementById('profile-name-display').textContent = appState.user.name;
    document.getElementById('profile-avatar').textContent = appState.user.name.charAt(0);
    document.getElementById('quick-avatar').textContent = appState.user.name.charAt(0);
    
    // Level & Badge count
    document.getElementById('profile-rank-display').textContent = `Level ${appState.user.level} Eco-Citizen`;
    
    // Calculate total impact saved
    // Each log savings, plus challenges completed
    let totalSaved = 0;
    appState.dailyLogs.forEach(l => {
        totalSaved += l.savings;
    });
    // Add completed challenges impact savings
    appState.challenges.forEach(ch => {
        if (ch.completed) totalSaved += (ch.xp * 2); // XP * 2 as a simulated kg carbon offset
    });

    document.getElementById('profile-total-impact').textContent = Math.round(totalSaved);
    
    // Calculate total accumulated XP
    let totalXPAccumulated = appState.user.xp;
    for (let l = 1; l < appState.user.level; l++) {
        totalXPAccumulated += (l * 100);
    }
    document.getElementById('profile-xp-display').textContent = totalXPAccumulated;

    const completedChallenges = appState.challenges.filter(c => c.completed).length;
    document.getElementById('profile-completed-challenges').textContent = completedChallenges;

    // Badges render
    const badgesContainer = document.getElementById('badges-container');
    badgesContainer.innerHTML = '';

    appState.badges.forEach(b => {
        const div = document.createElement('div');
        div.className = `badge-card ${b.unlocked ? 'unlocked' : ''}`;
        
        div.innerHTML = `
            <div class="badge-icon-wrapper">
                <i data-lucide="${b.icon}"></i>
            </div>
            <div class="badge-name">${b.name}</div>
            <div class="badge-desc">${b.desc}</div>
        `;
        badgesContainer.appendChild(div);
    });
    lucide.createIcons();
}
