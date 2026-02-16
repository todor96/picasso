// ─── LocalStorage Management ───

// Stats
function loadStats() {
  const saved = localStorage.getItem('picassoStats');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch(e) {
      // Ignore parse errors, return default
    }
  }
  return {
    totalCatches: 0,
    maxScore: 0,
    maxCombo: 0,
    maxSurvivalTime: 0,
    pizzasDodged: 0,
    gamesPlayed: 0
  };
}

function saveStats(stats) {
  localStorage.setItem('picassoStats', JSON.stringify(stats));
}

// Settings
function loadSettings() {
  const saved = localStorage.getItem('picassoSettings');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch(e) {
      // Ignore parse errors, return default
    }
  }
  return {
    soundEnabled: true,
    tiltEnabled: false
  };
}

function saveSettings(soundEnabled, tiltEnabled) {
  localStorage.setItem('picassoSettings', JSON.stringify({
    soundEnabled,
    tiltEnabled
  }));
}

// Leaderboard
function loadLeaderboard(mode) {
  const saved = localStorage.getItem(`picassoLeaderboard_${mode}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch(e) {
      // Ignore parse errors, return default
    }
  }
  return [];
}

function saveLeaderboard(mode, scores) {
  localStorage.setItem(`picassoLeaderboard_${mode}`, JSON.stringify(scores));
}

function addHighScore(mode, playerScore, playerNameInput, maxCombo) {
  const scores = loadLeaderboard(mode);
  scores.push({
    name: playerNameInput || 'Anonymous',
    score: playerScore,
    combo: maxCombo,
    date: new Date().toISOString()
  });
  scores.sort((a, b) => b.score - a.score);
  const trimmed = scores.slice(0, 10); // Keep top 10
  saveLeaderboard(mode, trimmed);
  return trimmed;
}

function isHighScore(mode, playerScore) {
  const scores = loadLeaderboard(mode);
  return scores.length < 10 || playerScore > scores[scores.length - 1].score;
}

// Tutorial
function hasSeenTutorial() {
  return localStorage.getItem('picassoTutorialSeen') === 'true';
}

function markTutorialSeen() {
  localStorage.setItem('picassoTutorialSeen', 'true');
}

// Achievements
function loadAchievements() {
  const saved = localStorage.getItem('picassoAchievements');
  return saved ? JSON.parse(saved) : [];
}

function saveAchievements(unlockedAchievements) {
  localStorage.setItem('picassoAchievements', JSON.stringify(unlockedAchievements));
}
