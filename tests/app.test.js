const { 
    getRankForLevel, 
    gainXP, 
    unlockBadge, 
    incrementChallenge, 
    personalizeFromOnboarding, 
    updateStreak,
    appState 
} = require('../app.js');

describe('EcoTrace Core State Logic', () => {
    beforeEach(() => {
        // Reset state
        appState.user = {
            name: 'Parth Patidar',
            xp: 0,
            level: 1,
            streak: 0,
            onboardingDone: false,
            onboardingAnswers: {}
        };
        appState.challenges = [
            { id: 'ch-1', title: 'Meatless Day', desc: 'Eat vegetarian or vegan all day', xp: 30, progress: 0, target: 1, completed: false },
            { id: 'ch-2', title: 'Pedal Power', desc: 'Walk or cycle instead of driving', xp: 45, progress: 0, target: 1, completed: false },
            { id: 'ch-3', title: 'Vampire Unplug', desc: 'Unplug idle electronics tonight', xp: 20, progress: 0, target: 1, completed: false }
        ];
        appState.badges = [
            { id: 'badge-1', name: 'First Sprout', desc: 'Log your first daily habit', icon: 'sprout', unlocked: false }
        ];
        appState.dailyLogs = [];
    });

    test('getRankForLevel returns correct rank info', () => {
        expect(getRankForLevel(1).name).toBe('Seed');
        expect(getRankForLevel(2).name).toBe('Sprout');
        expect(getRankForLevel(5).name).toBe('Forest Guardian');
        expect(getRankForLevel(10).name).toBe('Earth Champion');
    });

    test('gainXP increases XP and levels up correctly', () => {
        gainXP(40);
        expect(appState.user.xp).toBe(40);
        expect(appState.user.level).toBe(1);

        gainXP(70); // total 110. Level 1 needs 100 XP.
        expect(appState.user.xp).toBe(10);
        expect(appState.user.level).toBe(2);
    });

    test('unlockBadge unlocks badge and awards XP', () => {
        unlockBadge('badge-1');
        const badge = appState.badges.find(b => b.id === 'badge-1');
        expect(badge.unlocked).toBe(true);
        expect(appState.user.xp).toBe(50);
    });

    test('incrementChallenge updates progress and completes challenge', () => {
        incrementChallenge('ch-1');
        const ch = appState.challenges.find(c => c.id === 'ch-1');
        expect(ch.progress).toBe(1);
        expect(ch.completed).toBe(true);
        expect(appState.user.xp).toBe(30); // 30 XP rewarded
    });

    test('personalizeFromOnboarding sorts challenges based on answer', () => {
        appState.user.onboardingAnswers.challenge = 'transport';
        personalizeFromOnboarding();
        expect(appState.challenges[0].id).toBe('ch-2'); // Pedal Power should be first
    });
});
