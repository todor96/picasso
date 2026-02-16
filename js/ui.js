// ─── UI Rendering System ───

function draw() {
  ctx.save();
  
  // Screen shake
  if (screenShake > 0) {
    ctx.translate(
      (Math.random() - 0.5) * screenShake,
      (Math.random() - 0.5) * screenShake
    );
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Mode Selection Screen
  if (showModeSelect) {
    drawModeSelect();
    ctx.restore();
    return;
  }

  // Tutorial Overlay
  if (showTutorial) {
    drawTutorial();
    ctx.restore();
    return;
  }

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#1a1a2e');
  grad.addColorStop(1, '#16213e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Ground line
  ctx.strokeStyle = '#30475e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - 5);
  ctx.lineTo(canvas.width, canvas.height - 5);
  ctx.stroke();

  // Falling items
  items.forEach(item => {
    if (item.isPowerUp) {
      drawPowerUp(item);
    } else if (item.type.isHeart) {
      drawHeart(item);
    } else {
      ctx.drawImage(sprites[item.type.name], item.x, item.y, item.w, item.h);
    }
  });

  // Particles
  drawParticles(ctx);

  // Player (with shadow)
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#000';
  ctx.fillRect(player.x + 10, player.y + player.h - 5, player.w - 20, 10);
  ctx.globalAlpha = 1;
  ctx.drawImage(sprites.picasso, player.x, player.y, player.w, player.h);
  ctx.restore();

  // HUD elements
  drawHUD();

  ctx.restore();

  // Overlays (not affected by screen shake)
  if (paused && showPauseMenu) {
    drawPauseMenu();
  } else if (paused && !showPauseMenu) {
    drawSimplePause();
  }

  if (gameOver) {
    drawGameOver();
  }
}

function drawPowerUp(item) {
  ctx.save();
  ctx.globalAlpha = 0.8 + Math.sin(Date.now() / 200) * 0.2;
  ctx.fillStyle = item.powerUp.color;
  ctx.shadowBlur = 15;
  ctx.shadowColor = item.powerUp.color;
  ctx.beginPath();
  ctx.arc(item.x + item.w / 2, item.y + item.h / 2, item.w / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(item.powerUp.icon, item.x + item.w / 2, item.y + item.h / 2);
  ctx.restore();
}

function drawHeart(item) {
  ctx.save();
  ctx.globalAlpha = 0.9 + Math.sin(Date.now() / 150) * 0.1;
  ctx.fillStyle = '#ff69b4';
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#ff69b4';
  ctx.beginPath();
  ctx.arc(item.x + item.w / 2, item.y + item.h / 2, item.w / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('❤️', item.x + item.w / 2, item.y + item.h / 2);
  ctx.restore();
}

function drawHUD() {
  // Score (top right)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Score: ' + score, canvas.width - 20, 35);

  // Lives or Time Remaining (top right, below score)
  if (currentMode.timeLimit) {
    const elapsed = performance.now() - gameStartTime;
    const remaining = Math.max(0, Math.ceil((currentMode.timeLimit - elapsed) / 1000));
    ctx.fillStyle = remaining < 10 ? '#ff6b6b' : '#4ECDC4';
    ctx.font = '22px Arial, sans-serif';
    ctx.fillText('⏱️ ' + remaining + 's', canvas.width - 20, 65);
  } else if (lives !== Infinity) {
    ctx.fillStyle = '#ff6b6b';
    ctx.font = '22px Arial, sans-serif';
    const hearts = '\u2764'.repeat(lives) + '\u25CB'.repeat(MAX_LIVES - lives);
    ctx.fillText(hearts, canvas.width - 20, 65);
  }

  // Combo (center top)
  if (combo >= 2) {
    const comboScale = 1 + Math.min(combo / 20, 0.5);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = `bold ${24 * comboScale}px Arial, sans-serif`;
    const comboAlpha = Math.min(comboTimer / 2000, 1);
    
    // Outline
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.strokeText(combo + '× COMBO!', canvas.width / 2, 50);
    
    // Fill
    ctx.fillStyle = combo >= 10 ? '#FFD700' : combo >= 5 ? '#FFA500' : '#4ECDC4';
    ctx.globalAlpha = comboAlpha;
    ctx.fillText(combo + '× COMBO!', canvas.width / 2, 50);
    ctx.restore();
  }

  // Active Power-ups (left side)
  ctx.textAlign = 'left';
  ctx.font = '18px Arial, sans-serif';
  activePowerUps.forEach((powerUp, idx) => {
    const y = 35 + idx * 30;
    const timeLeft = Math.ceil((powerUp.endTime - performance.now()) / 1000);
    ctx.fillStyle = powerUp.color;
    ctx.fillText(`${powerUp.icon} ${powerUp.type.toUpperCase()} (${timeLeft}s)`, 20, y);
  });

  // Sound indicator (bottom left)
  ctx.fillStyle = soundEnabled ? '#4ECDC4' : '#666';
  ctx.font = '20px Arial';
  ctx.fillText(soundEnabled ? '🔊' : '🔇', 20, canvas.height - 20);
  ctx.font = '12px Arial';
  ctx.fillText('M', 45, canvas.height - 20);

  // Version number (bottom left)
  ctx.fillStyle = '#666';
  ctx.font = '11px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(GAME_VERSION, 70, canvas.height - 18);

  // Pause button (mobile, top-left)
  if (isMobile && !gameOver && !paused) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(5, 5, 50, 50);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(5, 5, 50, 50);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⏸', 30, 30);
    ctx.restore();
  }

  // Achievement notifications (bottom center)
  newAchievements.forEach((ach, idx) => {
    const elapsed = performance.now() - gameStartTime;
    const age = elapsed % 5000;
    if (age < 3000 && idx === newAchievements.length - 1) {
      const alpha = age < 500 ? age / 500 : age > 2500 ? (3000 - age) / 500 : 1;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.textAlign = 'center';
      
      // Background
      ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
      ctx.fillRect(canvas.width / 2 - 150, canvas.height - 120, 300, 60);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.strokeRect(canvas.width / 2 - 150, canvas.height - 120, 300, 60);
      
      // Text
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 20px Arial';
      ctx.fillText('🏆 Achievement Unlocked!', canvas.width / 2, canvas.height - 100);
      ctx.font = '16px Arial';
      ctx.fillStyle = '#fff';
      ctx.fillText(ach.name, canvas.width / 2, canvas.height - 75);
      ctx.restore();
    }
  });
}

function drawModeSelect() {
  ctx.fillStyle = 'rgba(26, 26, 46, 0.95)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f8d56b';
  ctx.font = 'bold 48px Arial, sans-serif';
  ctx.fillText('🍔 PICASSO CATCH', canvas.width / 2, 100);
  
  ctx.fillStyle = '#aaa';
  ctx.font = '20px Arial, sans-serif';
  ctx.fillText('Select Game Mode', canvas.width / 2, 160);
  
  const centerX = canvas.width / 2;
  const buttonWidth = 300;
  const buttonHeight = 80;
  const startY = 220;
  const spacing = 100;
  
  const modes = [
    { id: 'NORMAL', emoji: '🎮', title: 'NORMAL', desc: '3 lives • Power-ups enabled', color: '#4ECDC4' },
    { id: 'ZEN', emoji: '🧘', title: 'ZEN MODE', desc: 'Infinite lives • Slower pace', color: '#95E1D3' },
    { id: 'TIME_ATTACK', emoji: '⏱️', title: 'TIME ATTACK', desc: '60 seconds • Fast pace', color: '#F38181' },
    { id: 'HARDCORE', emoji: '💀', title: 'HARDCORE', desc: '2 lives • No power-ups • Fast', color: '#AA4465' }
  ];
  
  modes.forEach((mode, idx) => {
    const y = startY + idx * spacing;
    
    // Button background
    ctx.fillStyle = mode.color;
    ctx.fillRect(centerX - buttonWidth / 2, y, buttonWidth, buttonHeight);
    
    // Button border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - buttonWidth / 2, y, buttonWidth, buttonHeight);
    
    // Mode title
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.fillText(mode.emoji + ' ' + mode.title, centerX, y + 30);
    
    // Mode description
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText(mode.desc, centerX, y + 55);
  });
}

function drawTutorial() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const tutorialSteps = [
    {
      title: '👋 Welcome to Picasso Catch!',
      text: isMobile ? 'Tilt your device or drag to move Picasso' : 'Use arrow keys or mouse to move Picasso',
      demo: '⬅️ 🧑‍🍳 ➡️'
    },
    {
      title: '🍖 Catch the Good Food',
      text: 'Catch HRS and SUS (+2 points) or Muckalica (+1 point)\nBuild combos by catching multiple items quickly!',
      demo: '🍖 +2 | 🥘 +1'
    },
    {
      title: '🎁 Power-ups',
      text: '🛡️ Shield: Pizza immunity (10s)\n⏱️ Slow Mo: Slower falling (5s)\n🧲 Magnet: Auto-attract food (7s)\n2× Double: 2x points (10s)',
      demo: '🎁'
    },
    {
      title: '❤️ Hearts & Pizza',
      text: 'Catch hearts to gain extra lives!\nAvoid pizza or use shield to deflect it.',
      demo: '❤️ = +1 | 🍕 = ☠️'
    }
  ];
  
  const step = tutorialSteps[tutorialStep];
  if (!step) {
    showTutorial = false;
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
  
  ctx.textAlign = 'center';
  
  // Title
  ctx.fillStyle = '#f8d56b';
  ctx.font = 'bold 36px Arial, sans-serif';
  ctx.fillText(step.title, canvas.width / 2, 150);
  
  // Demo emoji/visual
  ctx.font = 'bold 48px Arial, sans-serif';
  ctx.fillText(step.demo, canvas.width / 2, 250);
  
  // Text
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial, sans-serif';
  const lines = step.text.split('\n');
  lines.forEach((line, idx) => {
    ctx.fillText(line, canvas.width / 2, 320 + idx * 30);
  });
  
  // Progress dots
  ctx.font = '24px Arial, sans-serif';
  const dots = tutorialSteps.map((_, idx) => idx === tutorialStep ? '⚫' : '⚪').join(' ');
  ctx.fillStyle = '#aaa';
  ctx.fillText(dots, canvas.width / 2, canvas.height - 120);
  
  // Next button
  const btnY = canvas.height - 80;
  const btnText = tutorialStep < tutorialSteps.length - 1 ? 'NEXT' : (tutorialFromPause ? 'BACK TO GAME' : 'START GAME');
  ctx.fillStyle = '#4ECDC4';
  ctx.fillRect(canvas.width / 2 - 100, btnY, 200, 50);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.fillText(btnText, canvas.width / 2, btnY + 33);
  
  // Skip/Close button
  if (tutorialStep < tutorialSteps.length - 1 || tutorialFromPause) {
    ctx.fillStyle = '#666';
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText(tutorialFromPause ? 'Close (ESC)' : 'Skip Tutorial', canvas.width / 2, canvas.height - 20);
  }
}

function drawPauseMenu() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#4ECDC4';
  ctx.font = 'bold 48px Arial, sans-serif';
  ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2 - 120);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const buttonWidth = 200;
  const buttonHeight = 50;

  // Helper function to draw a button
  function drawButton(y, text, enabled = true) {
    ctx.fillStyle = enabled ? 'rgba(78, 205, 196, 0.3)' : 'rgba(100, 100, 100, 0.3)';
    ctx.fillRect(centerX - buttonWidth / 2, y, buttonWidth, buttonHeight);
    ctx.strokeStyle = enabled ? '#4ECDC4' : '#666';
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - buttonWidth / 2, y, buttonWidth, buttonHeight);
    ctx.fillStyle = enabled ? '#fff' : '#aaa';
    ctx.font = '20px Arial, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, centerX, y + buttonHeight / 2);
  }

  // Resume button
  drawButton(centerY - 60, '▶ Resume');

  // Sound toggle
  drawButton(centerY + 10, soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF');

  // Tilt controls (mobile only)
  if (isMobile) {
    drawButton(centerY + 75, tiltEnabled ? '📱 Tilt: ON' : '📱 Tilt: OFF');
  }

  // Tutorial button
  const tutorialY = isMobile ? centerY + 140 : centerY + 75;
  drawButton(tutorialY, '📖 Tutorial');

  // Reset stats
  const resetY = isMobile ? centerY + 205 : centerY + 140;
  drawButton(resetY, '🗑️ Reset Stats');

  // Change Mode button
  const changeModeY = isMobile ? centerY + 270 : centerY + 205;
  drawButton(changeModeY, '🎮 Change Mode');

  // Instructions
  ctx.fillStyle = '#aaa';
  ctx.font = '16px Arial, sans-serif';
  const instructY = isMobile ? changeModeY + 80 : centerY + 280;
  if (isMobile) {
    ctx.fillText('Tap buttons to adjust settings', centerX, instructY);
  } else {
    ctx.fillText('Press ESC or P to resume', centerX, instructY);
    ctx.fillText('Press M to change mode', centerX, instructY + 25);
  }
}

function drawSimplePause() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 48px Arial';
  ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
  ctx.font = '20px Arial';
  ctx.fillText('Press ESC or P to resume', canvas.width / 2, canvas.height / 2 + 50);
}

function drawGameOver() {
  // Dim overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';

  // Check if this is a high score that needs name entry
  const isNewHighScore = isHighScore(currentMode.id, score);
  const needsNameEntry = isNewHighScore && !playerName;

  if (needsNameEntry) {
    drawNameEntry();
    return;
  }

  // GAME OVER text
  ctx.fillStyle = '#ff6b6b';
  ctx.font = 'bold 48px Arial, sans-serif';
  ctx.fillText('GAME OVER', canvas.width / 2, 80);

  // Reason
  ctx.fillStyle = '#ffffff';
  ctx.font = '20px Arial, sans-serif';
  const reason = lives <= 0 ? (currentMode.timeLimit ? 'Time\'s up!' : 'Out of lives!') : 'You caught a pizza!';
  ctx.fillText(reason, canvas.width / 2, 120);

  // Final score
  ctx.fillStyle = '#f8d56b';
  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.fillText('Score: ' + score, canvas.width / 2, 160);

  // Max combo
  if (maxCombo >= 2) {
    ctx.fillStyle = '#4ECDC4';
    ctx.font = '20px Arial, sans-serif';
    ctx.fillText('Max Combo: ' + maxCombo + '×', canvas.width / 2, 190);
  }

  // Leaderboard
  const leaderboard = loadLeaderboard(currentMode.id);
  if (leaderboard.length > 0) {
    ctx.fillStyle = '#f8d56b';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.fillText('🏆 ' + currentMode.name + ' Leaderboard', canvas.width / 2, 230);

    ctx.font = '18px Arial, sans-serif';
    const startY = 260;
    const maxShow = Math.min(5, leaderboard.length);

    for (let i = 0; i < maxShow; i++) {
      const entry = leaderboard[i];
      const y = startY + i * 30;
      
      // Highlight current player's score
      const isPlayerScore = isNewHighScore && entry.score === score && entry.name === playerName;
      if (isPlayerScore) {
        ctx.fillStyle = '#4ECDC4';
        ctx.fillRect(canvas.width / 2 - 180, y - 20, 360, 28);
      }

      ctx.fillStyle = isPlayerScore ? '#000' : '#fff';
      ctx.textAlign = 'left';
      ctx.fillText(`${i + 1}. ${entry.name}`, canvas.width / 2 - 170, y);
      ctx.textAlign = 'right';
      ctx.fillText(`${entry.score}`, canvas.width / 2 + 170, y);
    }

    ctx.textAlign = 'center';
  }

  // Stats
  ctx.fillStyle = '#aaa';
  ctx.font = '16px Arial, sans-serif';
  const statsY = leaderboard.length > 0 ? 420 : 220;
  ctx.fillText(`Best: ${stats.maxScore} | Achievements: ${unlockedAchievements.length}/${ACHIEVEMENTS.length}`, canvas.width / 2, statsY);

  // Restart prompt
  ctx.fillStyle = '#aaa';
  ctx.font = '18px Arial, sans-serif';
  const promptY = leaderboard.length > 0 ? 460 : 260;
  ctx.fillText(isMobile ? 'Tap to Play Again' : 'Press ENTER or Click to Play Again', canvas.width / 2, promptY);

  // Mode selection hint
  ctx.font = '14px Arial,sans-serif';
  ctx.fillText('Press M to change mode', canvas.width / 2, promptY + 25);
}

function drawNameEntry() {
  ctx.fillStyle = '#f8d56b';
  ctx.font = 'bold 48px Arial, sans-serif';
  ctx.fillText('🏆 NEW HIGH SCORE!', canvas.width / 2, 150);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 36px Arial, sans-serif';
  ctx.fillText('Score: ' + score, canvas.width / 2, 220);

  ctx.font = '24px Arial, sans-serif';
  ctx.fillText('Enter your name:', canvas.width / 2, 280);

  // Name input box
  const inputWidth = 300;
  const inputHeight = 50;
  const inputY = 310;
  ctx.fillStyle = '#fff';
  ctx.fillRect(canvas.width / 2 - inputWidth / 2, inputY, inputWidth, inputHeight);
  ctx.strokeStyle = '#4ECDC4';
  ctx.lineWidth = 3;
  ctx.strokeRect(canvas.width / 2 - inputWidth / 2, inputY, inputWidth, inputHeight);

  // Display entered name
  ctx.fillStyle = '#000';
  ctx.font = '28px Arial, sans-serif';
  ctx.fillText(playerName || '_', canvas.width / 2, inputY + 35);

  // Instructions
  ctx.fillStyle = '#aaa';
  ctx.font = '18px Arial, sans-serif';
  ctx.fillText(isMobile ? 'Tap to enter name' : 'Type your name and press ENTER', canvas.width / 2, inputY + 80);
}
