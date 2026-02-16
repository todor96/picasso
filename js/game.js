// ─── Picasso Catch - Main Game Logic ───

// Canvas Setup
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// ─── Game State Variables ───
let player, items = [], score, lives, gameOver = false, fallSpeed, spawnInterval;
let lastSpawn, lastDifficulty, gameStartTime, keys = {}, animFrameId;
let combo, comboTimer, maxCombo, activePowerUps = [], lastPowerUpSpawn;
let stats, unlockedAchievements, newAchievements = [];
let paused = false, showPauseMenu = false, tiltEnabled, pauseStartTime;
let currentMode = GAME_MODES.NORMAL;
let showModeSelect = false;
let showTutorial = false;
let tutorialStep = 0;
let tutorialFromPause = false;
let playerName = '';
let highScores;
let pointerX = null;
let touchStartX = null;
let tiltX = 0;

// ─── Achievements System ───
function checkAchievements() {
  ACHIEVEMENTS.forEach(ach => {
    if (!unlockedAchievements.includes(ach.id) && ach.check(stats)) {
      unlockedAchievements.push(ach.id);
      newAchievements.push(ach);
      playSound('achievement');
      saveAchievements(unlockedAchievements);
    }
  });
}

// ─── Game State Reset ───
function resetState() {
  const mode = currentMode || GAME_MODES.NORMAL;
  player = { x: canvas.width / 2 - PLAYER_WIDTH / 2, y: canvas.height - PLAYER_HEIGHT - 20, w: PLAYER_WIDTH, h: PLAYER_HEIGHT };
  items = [];
  score = 0;
  lives = mode.lives === Infinity ? Infinity : mode.lives;
  gameOver = false;
  fallSpeed = INITIAL_FALL_SPEED * mode.speedMultiplier;
  spawnInterval = INITIAL_SPAWN_INTERVAL / mode.speedMultiplier;
  lastDifficulty = performance.now();
  gameStartTime = performance.now();
  combo = 0;
  comboTimer = 0;
  maxCombo = 0;
  activePowerUps = [];
  lastPowerUpSpawn = performance.now();
  newAchievements = [];
  showPauseMenu = false;
  paused = false;
  particles = [];
  screenShake = 0;

  stats.gamesPlayed++;
  saveStats(stats);
}

// ─── Spawning Functions ───
function spawnItem() {
  let type;
  const rand = Math.random();
  
  // Hearts spawn only 8% of the time
  if (rand < 0.08) {
    type = FOOD_TYPES.find(t => t.isHeart);
  } else {
    const regularFood = FOOD_TYPES.filter(t => !t.isHeart);
    type = regularFood[Math.floor(Math.random() * regularFood.length)];
  }
  
  const x = Math.random() * (canvas.width - ITEM_SIZE);
  items.push({ x, y: -ITEM_SIZE, w: ITEM_SIZE, h: ITEM_SIZE, type, isPowerUp: false });
}

function spawnPowerUp() {
  const powerUp = POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
  const x = Math.random() * (canvas.width - ITEM_SIZE);
  items.push({ x, y: -ITEM_SIZE, w: ITEM_SIZE, h: ITEM_SIZE, powerUp, isPowerUp: true });
}

// ─── Power-Up Management ───
function activatePowerUp(powerUp) {
  const existing = activePowerUps.find(p => p.type === powerUp.type);
  if (existing) {
    existing.endTime = performance.now() + powerUp.duration;
  } else {
    activePowerUps.push({
      type: powerUp.type,
      color: powerUp.color,
      icon: powerUp.icon,
      endTime: performance.now() + powerUp.duration
    });
  }
}

function hasPowerUp(type) {
  return activePowerUps.some(p => p.type === type && p.endTime > performance.now());
}

// ─── Update Loop ───
function update(now) {
  if (showModeSelect || showTutorial || gameOver || paused) {
    updateParticles();
    return;
  }

  const delta = now - (lastSpawn || now);
  const mode = currentMode;

  // Difficulty scaling
  if (now - lastDifficulty > DIFFICULTY_INTERVAL) {
    fallSpeed += SPEED_INCREMENT * mode.speedMultiplier;
    spawnInterval = Math.max(MIN_SPAWN_INTERVAL, spawnInterval - SPAWN_DECREMENT);
    lastDifficulty = now;
  }

  // Check time limit
  if (mode.timeLimit) {
    const elapsed = now - gameStartTime;
    if (elapsed >= mode.timeLimit) {
      const survivalTime = Math.floor(elapsed / 1000);
      stats.maxSurvivalTime = Math.max(stats.maxSurvivalTime, survivalTime);
      gameOver = true;
      return;
    }
  }

  // Player movement
  let targetX = player.x;
  
  // Keyboard
  if (keys['ArrowLeft'] || keys['a'] || keys['A']) targetX -= PLAYER_SPEED;
  if (keys['ArrowRight'] || keys['d'] || keys['D']) targetX += PLAYER_SPEED;
  
  // Mouse/Touch
  if (pointerX !== null) targetX = pointerX - player.w / 2;
  
  // Tilt
  if (tiltEnabled && tiltX !== 0) targetX += tiltX * PLAYER_SPEED;
  
  // Boundary check
  player.x = Math.max(0, Math.min(canvas.width - player.w, targetX));

  // Combo timer decay
  if (comboTimer > 0) {
    comboTimer -= 16.67; // ~60fps
    if (comboTimer <= 0) {
      combo = 0;
    }
  }

  // Spawn items
  if (delta >= spawnInterval) {
    spawnItem();
    lastSpawn = now;
  }

  // Power-up spawning (every 20 seconds if enabled)
  if (mode.powerUps && now - lastPowerUpSpawn > 20000) {
    spawnPowerUp();
    lastPowerUpSpawn = now;
  }

  // Update active power-ups
  for (let i = activePowerUps.length - 1; i >= 0; i--) {
    if (activePowerUps[i].endTime <= now) {
      activePowerUps.splice(i, 1);
    }
  }

  // Apply slowmo effect
  const actualFallSpeed = hasPowerUp('slowmo') ? fallSpeed * 0.5 : fallSpeed;

  // Move items
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    item.y += actualFallSpeed;

    // Magnet effect
    if (hasPowerUp('magnet') && !item.type?.deadly && !item.isPowerUp) {
      const dx = (player.x + player.w / 2) - (item.x + item.w / 2);
      const dy = (player.y + player.h / 2) - (item.y + item.h / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        item.x += (dx / dist) * 3;
        item.y += (dy / dist)  * 3;
      }
    }

    // Collision detection
    const playerMask = alphaMasks['picasso'];
    const itemMask = item.isPowerUp ? null : alphaMasks[item.type.name];

    if (item.isPowerUp) {
      // Simple box collision for power-ups
      if (player.x < item.x + item.w &&
          player.x + player.w > item.x &&
          player.y < item.y + item.h &&
          player.y + player.h > item.y) {
        activatePowerUp(item.powerUp);
        playSound('powerup');
        createParticles(item.x + item.w / 2, item.y + item.h / 2, 15, item.powerUp.color, 4);
        items.splice(i, 1);
        vibrate(15);
      }
    } else if (itemMask && pixelPerfectCollision(player, playerMask, item, itemMask)) {
      // Caught item
      if (item.type.deadly) {
        // Pizza
        if (hasPowerUp('shield')) {
          playSound('powerup');
          createParticles(item.x + item.w / 2, item.y + item.h / 2, 20, '#FFD700', 5);
          items.splice(i, 1);
        } else {
          playSound('pizza');
          gameOver = true;
          screenShake = 20;
          createParticles(item.x + item.w / 2, item.y + item.h / 2, 30, '#ff0000', 6);
          vibrate(200);
          const survivalTime = Math.floor((now - gameStartTime) / 1000);
          stats.maxSurvivalTime = Math.max(stats.maxSurvivalTime, survivalTime);
        }
      } else if (item.type.isHeart) {
        // Heart - extra life
        if (lives !== Infinity && lives < MAX_LIVES) {
          lives++;
          playSound('powerup');
          createParticles(item.x + item.w / 2, item.y + item.h / 2, 20, '#ff69b4', 5);
          vibrate(20);
        }
        items.splice(i, 1);
      } else {
        // Regular food
        const points = hasPowerUp('double') ? item.type.points * 2 : item.type.points;
        score += points;
        combo++;
        comboTimer = 2000; // 2 seconds to maintain combo
        
        stats.totalCatches++;
        maxCombo = Math.max(maxCombo, combo);
        
        const soundType = item.type.points === 2 ? 'catch2' : 'catch1';
        playSound(combo >= 3 ? 'combo' : soundType);
        
        const color = item.type.points === 2 ? '#4ECDC4' : '#95E1D3';
        createParticles(item.x + item.w / 2, item.y + item.h / 2, 10, color);
        
        items.splice(i, 1);
        vibrate(8);
      }
    }

    // Remove items that fell off screen
    if (item.y > canvas.height) {
      if (!item.isPowerUp && !item.type.isHeart) {
        if (item.type.deadly) {
          stats.pizzasDodged++;
        } else {
          // Missed food
          if (combo >= 3) playSound('miss');
          combo = 0;
          comboTimer = 0;
          
          if (lives !== Infinity) {
            lives--;
            if (lives <= 0) {
              gameOver = true;
              playSound('miss');
              screenShake = 10;
              const survivalTime = Math.floor((now - gameStartTime) / 1000);
              stats.maxSurvivalTime = Math.max(stats.maxSurvivalTime, survivalTime);
            }
          }
        }
      }
      items.splice(i, 1);
    }
  }

  // Update particles
  updateParticles();

  // Check achievements
  stats.maxScore = Math.max(stats.maxScore, score);
  stats.maxCombo = Math.max(stats.maxCombo, combo);
  saveStats(stats);
  checkAchievements();
}

// ─── Pause System ───
function togglePause() {
  if (paused) {
    const pauseDuration = performance.now() - pauseStartTime;
    gameStartTime += pauseDuration;
    lastSpawn += pauseDuration;
    lastDifficulty += pauseDuration;
    lastPowerUpSpawn += pauseDuration;
    paused = false;
    showPauseMenu = false;
  } else {
    paused = true;
    showPauseMenu = !isMobile;
    pauseStartTime = performance.now();
  }
}

// ─── Game Loop ───
function loop(now) {
  update(now);
  draw();
  animFrameId = requestAnimationFrame(loop);
}

// ─── Start / Restart Game ───
function startGame() {
  if (animFrameId) cancelAnimationFrame(animFrameId);
  
  if (gameOver && score > 0 && playerName) {
    playerName = '';
  }
  
  resetState();
  lastSpawn = performance.now();
  pointerX = null;
  animFrameId = requestAnimationFrame(loop);
}

// ─── Initialization ───
function init() {
  // Load saved data
  stats = loadStats();
  unlockedAchievements = loadAchievements();
  const settings = loadSettings();
  soundEnabled = settings.soundEnabled;
  tiltEnabled = settings.tiltEnabled;
  
  // Check if first time user
  if (!hasSeenTutorial()) {
    showTutorial = true;
    tutorialStep = 0;
  } else {
    showModeSelect = true;
  }
  
  animFrameId = requestAnimationFrame(loop);
}

// ─── Loading Screen ───
function drawLoadingScreen() {
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.font = '28px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Loading...', canvas.width / 2, canvas.height / 2);
}

// Start the game
drawLoadingScreen();
loadAssets(() => init());
