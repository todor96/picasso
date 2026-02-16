# Picasso Catch Game - Modular Structure

## Overview
The game code has been reorganized from a single `index.html` file into a modular structure for better maintainability and organization.

## File Structure

```
PICASSO_GAME/
├── index.html              # Minimal HTML file that loads modules
├── index_old.html          # Backup of original monolithic file
├── js/
│   ├── config.js           # Game configuration and constants
│   ├── utils.js            # Utility functions (mobile detection, collision, vibrate)
│   ├── audio.js            # Sound effects system
│   ├── particles.js        # Particle effects system
│   ├── sprites.js          # Sprite loading and asset management
│   ├── storage.js          # localStorage functions (stats, settings, leaderboard)
│   ├── ui.js               # All rendering/drawing functions
│   ├── game.js             # Core game logic and update loop
│   └── input.js            # Input handling (keyboard, mouse, touch, tilt)
├── sprites/                # Game sprite images
├── icons/                  # PWA icons
├── manifest.json           # PWA manifest
└── sw.js                   # Service worker

## Module Descriptions

### config.js
- Game version
- Player and item sizes
- Gameplay constants (speeds, intervals, etc.)
- Food types and points
- Power-up types
- Achievements
- Game modes (Normal, Zen, Time Attack, Hardcore)
- Sprite names for loading

### utils.js
- `isMobile` - Mobile device detection
- `vibrate(duration)` - Haptic feedback
- `pixelPerfectCollision()` - Pixel-perfect collision detection

### audio.js
- `audioCtx` - Web Audio API context
- `soundEnabled` - Global sound toggle
- `playSound(type)` - Play different sound effects (catch, combo, powerup, miss, pizza, achievement)

### particles.js
- `particles[]` - Particle array
- `screenShake` - Screen shake effect value
- `createParticles(x, y, count, color, size)` - Create particle burst
- `updateParticles()` - Update particle physics
- `drawParticles(ctx)` - Render particles

### sprites.js
- `sprites{}` - Loaded sprite images
- `alphaMasks{}` - Pre-computed alpha masks for collision
- `buildAlphaMask(img, w, h)` - Generate collision mask
- `loadAssets(callback)` - Load all sprites and build masks

### storage.js
- `loadStats()` / `saveStats(stats)` - Persistent player statistics
- `loadSettings()` / `saveSettings(soundEnabled, tiltEnabled)` - User preferences  
- `loadLeaderboard(mode)` / `saveLeaderboard(mode, scores)` - High scores per mode
- `addHighScore(mode, score, name, combo)` - Add entry to leaderboard
- `isHighScore(mode, score)` - Check if score qualifies
- `hasSeenTutorial()` / `markTutorialSeen()` - Tutorial status
- `loadAchievements()` / `saveAchievements(unlocked)` - Achievement tracking

### ui.js
- `draw()` - Main rendering function
- `drawModeSelect()` - Mode selection screen
- `drawTutorial()` - Tutorial overlay
- `drawHUD()` - In-game HUD (score, lives, combo, power-ups)
- `drawPauseMenu()` - Pause menu overlay
- `drawSimplePause()` - Simple pause indicator
- `drawGameOver()` - Game over screen
- `drawNameEntry()` - High score name entry
- `drawPowerUp(item)` / `drawHeart(item)` - Special item rendering

### game.js
- **State variables**: player, items, score, lives, gameOver, combo, etc.
- `checkAchievements()` - Check and unlock achievements
- `resetState()` - Initialize/reset game state for new game
- `spawnItem()` / `spawnPowerUp()` - Spawn gameplay objects
- `activatePowerUp(powerUp)` / `hasPowerUp(type)` - Power-up management
- `update(now)` - Main game loop update (physics, collision, spawning)
- `togglePause()` - Pause/resume functionality
- `loop(now)` - RequestAnimationFrame loop
- `startGame()` / `init()` - Game initialization

### input.js
- Keyboard event handlers (movement, pause, mode selection, name entry)
- Mouse/touch event handlers
- Device orientation (tilt) support
- Click handlers for UI buttons
- `handlePauseMenuClick(x, y)` - Pause menu interaction

## Loading Order

The modules must be loaded in this specific order (as defined in `index.html`):

1. **config.js** -Constants needed by all other modules
2. **utils.js** - Utilities used across modules
3. **audio.js** - Sound system
4. **particles.js** - Visual effects
5. **sprites.js** - Asset loading
6. **storage.js** - Data persistence
7. **ui.js** - Rendering (depends on most other modules)
8. **game.js** - Game logic (depends on all above)
9. **input.js** - Input handling (depends on game state)

## Benefits of Modular Structure

✅ **Better Organization** - Related code is grouped together
✅ **Easier Maintenance** - Find and fix issues faster
✅ **Reusability** - Modules can be reused or replaced independently
✅ **Collaboration** - Multiple developers can work on different modules
✅ **Debugging** - Easier to isolate problems to specific modules
✅ **Testing** - Individual modules can be tested separately

## Backward Compatibility

The original monolithic version is preserved as `index_old.html` for reference or rollback if needed.

## Future Improvements

Potential next steps for further modularization:
- Convert to ES6 modules with `import`/`export`
- Bundle with a build tool (Webpack, Rollup, Vite)
- Add TypeScript for type safety
- Separate CSS into external stylesheet
- Create a dedicated collision module
- Split UI into multiple files (screens, HUD, menus)
