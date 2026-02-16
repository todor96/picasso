// ─── Input Handling System ───

// Keyboard input
window.addEventListener('keydown', e => {
  keys[e.key] = true;

  // Name entry for high score
  if (gameOver && isHighScore(currentMode.id, score) && !playerName) {
    if (e.key === 'Enter' && playerName && playerName.trim().length > 0) {
      addHighScore(currentMode.id, score, playerName.trim(), maxCombo);
      return;
    }
    if (e.key === 'Backspace') {
      playerName = playerName.slice(0, -1);
      return;
    }
    if (e.key.length === 1 && playerName.length < 15) {
      playerName += e.key;
      return;
    }
    return; // Block other keys during name entry
  }

  // Tutorial navigation
  if (showTutorial) {
    if (e.key === 'Enter' || e.key === ' ') {
      tutorialStep++;
      if (tutorialStep >= 4) {
        showTutorial = false;
        if (!tutorialFromPause) {
          markTutorialSeen();
          showModeSelect = true;
        } else {
          tutorialFromPause = false;
          paused = true;
          showPauseMenu = true;
        }
      }
      return;
    }
    if (e.key === 'Escape') {
      showTutorial = false;
      tutorialStep = 0;
      if (!tutorialFromPause) {
        markTutorialSeen();
        showModeSelect = true;
      } else {
        tutorialFromPause = false;
        paused = true;
        showPauseMenu = true;
      }
      return;
    }
    return;
  }

  // Mode selection with number keys
  if (showModeSelect) {
    const modes = ['NORMAL', 'ZEN', 'TIME_ATTACK', 'HARDCORE'];
    if (e.key >= '1' && e.key <= '4') {
      currentMode = GAME_MODES[modes[e.key - 1]];
      showModeSelect = false;
      startGame();
      return;
    }
    return;
  }

  // Restart on Enter when game is over
  if (gameOver && e.key === 'Enter') {
    startGame();
    return;
  }

  // Return to mode select from game over
  if (gameOver && (e.key === 'm' || e.key === 'M')) {
    showModeSelect = true;
    playerName = '';
    return;
  }

  // Pause toggle (Escape or P)
  if ((e.key === 'Escape' || e.key === 'p' || e.key === 'P') && !gameOver) {
    togglePause();
    return;
  }

  // Change mode when paused (M key)
  if ((e.key === 'm' || e.key === 'M') && paused && !gameOver) {
    showModeSelect = true;
    paused = false;
    showPauseMenu = false;
    return;
  }

  // Mute toggle (M key when not paused)
  if ((e.key === 'm' || e.key === 'M') && !paused && !gameOver) {
    soundEnabled = !soundEnabled;
    saveSettings(soundEnabled, tiltEnabled);
  }
});

window.addEventListener('keyup', e => { keys[e.key] = false; });

// Tilt controls (device orientation)
if (isMobile && window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', e => {
    if (!tiltEnabled || !e.gamma) return;
    // gamma is tilt left/right: -90 to 90
    tiltX = Math.max(-30, Math.min(30, e.gamma)) / 30; // normalize to -1 to 1
  });
}

// Mouse / touch control
canvas.addEventListener('mousemove', e => { 
  if (!isMobile) pointerX = e.clientX; 
});

canvas.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  const touch = e.touches[0];
  pointerX = touch.clientX;
}, { passive: false });

canvas.addEventListener('touchend', e => { 
  const touch = e.changedTouches[0];
  
  // Check if tapped pause button (top-left corner on mobile)
  if (!gameOver && isMobile) {
    const pauseButtonSize = 55;
    if (touch.clientX < pauseButtonSize && touch.clientY < pauseButtonSize) {
      if (paused) {
        showPauseMenu = !showPauseMenu;
      } else {
        paused = true;
        showPauseMenu = true;
        pauseStartTime = performance.now();
      }
      vibrate(10);
      e.preventDefault();
      pointerX = null;
      touchStartX = null;
      return;
    }
  }
  
  pointerX = null;
  touchStartX = null;
});

// Click / Touch handlers
canvas.addEventListener('click', e => {
  const x = e.clientX;
  const y = e.clientY;

  // Mode Selection
  if (showModeSelect) {
    const centerX = canvas.width / 2;
    const buttonWidth = 300;
    const buttonHeight = 80;
    const startY = 220;
    const spacing = 100;
    const modes = ['NORMAL', 'ZEN', 'TIME_ATTACK', 'HARDCORE'];

    for (let i = 0; i < modes.length; i++) {
      const btnY = startY + i * spacing;
      if (x >= centerX - buttonWidth / 2 && x <= centerX + buttonWidth / 2 &&
          y >= btnY && y <= btnY + buttonHeight) {
        currentMode = GAME_MODES[modes[i]];
        showModeSelect = false;
        vibrate(10);
        startGame();
        return;
      }
    }
    return;
  }

  // Tutorial
  if (showTutorial) {
    const btnY = canvas.height - 80;
    
    // Next/Start button
    if (x >= canvas.width / 2 - 100 && x <= canvas.width / 2 + 100 &&
        y >= btnY && y <= btnY + 50) {
      tutorialStep++;
      if (tutorialStep >= 4) {
        showTutorial = false;
        if (!tutorialFromPause) {
          markTutorialSeen();
          showModeSelect = true;
        } else {
          tutorialFromPause = false;
          paused = true;
          showPauseMenu = true;
        }
      }
      vibrate(8);
      return;
    }

    // Skip/Close button
    if ((tutorialStep < 3 || tutorialFromPause) && y >= canvas.height - 35 && y <= canvas.height - 5) {
      showTutorial = false;
      tutorialStep = 0;
      if (!tutorialFromPause) {
        markTutorialSeen();
        showModeSelect = true;
      } else {
        tutorialFromPause = false;
        paused = true;
        showPauseMenu = true;
      }
      vibrate(8);
      return;
    }
    return;
  }

  // Name entry for high score (mobile)
  if (gameOver && isHighScore(currentMode.id, score) && !playerName && isMobile) {
    const namePrompt = prompt('🏆 New High Score!\n\nEnter your name:');
    if (namePrompt && namePrompt.trim().length > 0) {
      playerName = namePrompt.trim().substring(0, 15);
      addHighScore(currentMode.id, score, playerName, maxCombo);
    }
    return;
  }

  // Game over - restart or mode select
  if (gameOver) {
    const leaderboard = loadLeaderboard(currentMode.id);
    const promptY = leaderboard.length > 0 ? 460 : 260;
    if (y >= promptY + 10 && y <= promptY + 40) {
      showModeSelect = true;
      playerName = '';
      vibrate(10);
    } else {
      startGame();
    }
    return;
  }

  // Handle pause menu clicks
  if (paused && showPauseMenu) {
    handlePauseMenuClick(x, y);
  }
});

function handlePauseMenuClick(x, y) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const buttonWidth = 200;
  const buttonHeight = 50;

  // Resume button
  if (x >= centerX - buttonWidth / 2 && x <= centerX + buttonWidth / 2 &&
      y >= centerY - 60 && y <= centerY - 10) {
    togglePause();
    vibrate(10);
    return;
  }

  // Sound toggle button
  if (x >= centerX - buttonWidth / 2 && x <= centerX + buttonWidth / 2 &&
      y >= centerY + 10 && y <= centerY + 60) {
    soundEnabled = !soundEnabled;
    saveSettings(soundEnabled, tiltEnabled);
    vibrate(10);
    return;
  }

  // Tilt controls toggle (mobile only)
  if (isMobile && x >= centerX - buttonWidth / 2 && x <= centerX + buttonWidth / 2 &&
      y >= centerY + 75 && y <= centerY + 125) {
    tiltEnabled = !tiltEnabled;
    saveSettings(soundEnabled, tiltEnabled);
    vibrate(10);
    return;
  }

  // Tutorial button
  const tutorialY = isMobile ? centerY + 140 : centerY + 75;
  if (x >= centerX - buttonWidth / 2 && x <= centerX + buttonWidth / 2 &&
      y >= tutorialY && y <= tutorialY + 50) {
    showTutorial = true;
    tutorialStep = 0;
    tutorialFromPause = true;
    paused = false;
    showPauseMenu = false;
    vibrate(10);
    return;
  }

  // Reset stats button
  const resetY = isMobile ? centerY + 205 : centerY + 140;
  if (x >= centerX - buttonWidth / 2 && x <= centerX + buttonWidth / 2 &&
      y >= resetY && y <= resetY + 50) {
    if (confirm('Reset all stats and achievements?')) {
      localStorage.removeItem('picassoStats');
      localStorage.removeItem('picassoAchievements');
      stats = loadStats();
      unlockedAchievements = loadAchievements();
      vibrate(20);
    }
    return;
  }

  // Change Mode button
  const changeModeY = isMobile ? centerY + 270 : centerY + 205;
  if (x >= centerX - buttonWidth / 2 && x <= centerX + buttonWidth / 2 &&
      y >= changeModeY && y <= changeModeY + 50) {
    showModeSelect = true;
    paused = false;
    showPauseMenu = false;
    vibrate(10);
    return;
  }
}
