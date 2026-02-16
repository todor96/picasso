# 🍔 Picasso Catch Game

A fun and addictive browser-based catching game where you play as Picasso, catching delicious Serbian food while avoiding pizza! Built with vanilla JavaScript and HTML5 Canvas.

## 🎮 Play Now

**Live Demo:** https://todor96.github.io/picasso

## 📖 About

Catch HRS, SUS, and Muckalica while avoiding deadly pizzas! Build combos, collect power-ups, and compete for high scores across multiple game modes.

## ✨ Features

### 🎯 Multiple Game Modes
- **Normal Mode** - Classic gameplay with 3 lives and power-ups
- **Zen Mode** - Relaxing endless mode with infinite lives and slower pace
- **Time Attack** - 60-second sprint for maximum score
- **Hardcore Mode** - 2 lives, no power-ups, fast-paced challenge

### 🎁 Power-ups
- **🛡️ Shield** - Pizza immunity for 10 seconds
- **⏱️ Slow Mo** - Slower falling items for 5 seconds
- **🧲 Magnet** - Auto-attract food for 7 seconds
- **2× Double** - Double points for 10 seconds
- **❤️ Heart** - Extra life (up to 3 lives)

### 🏆 Features
- **Combo System** - Catch multiple items quickly to build combos
- **Achievement System** - Unlock achievements for various milestones
- **Leaderboards** - High score tracking for each game mode
- **Progressive Difficulty** - Game speeds up as you survive longer
- **Power-up System** - Strategic power-ups to enhance gameplay
- **Pixel-Perfect Collision** - Accurate collision detection
- **Mobile Support** - Touch controls and tilt support
- **PWA Ready** - Install as a Progressive Web App
- **Offline Play** - Service worker for offline gaming

### 📱 Controls

**Desktop:**
- Arrow keys or A/D to move left/right
- Mouse movement to control player
- P or ESC to pause
- M to toggle sound / change mode (when paused)
- Number keys 1-4 for quick mode selection

**Mobile:**
- Drag to move
- Tilt device (optional)
- Tap pause button to pause
- Touch controls for menus

## 🛠️ Technical Details

### Built With
- **Vanilla JavaScript** - No frameworks, pure JS
- **HTML5 Canvas** - 2D rendering
- **Web Audio API** - Dynamic sound effects
- **LocalStorage API** - Persistent stats and settings
- **Service Workers** - PWA capabilities and offline support
- **Device Orientation API** - Tilt controls on mobile

### Project Structure
```
PICASSO_GAME/
├── index.html              # Main HTML file
├── js/
│   ├── config.js           # Game configuration and constants
│   ├── utils.js            # Utility functions
│   ├── audio.js            # Sound effects system
│   ├── particles.js        # Particle effects
│   ├── sprites.js          # Asset loading
│   ├── storage.js          # localStorage management
│   ├── ui.js               # All rendering functions
│   ├── game.js             # Core game logic
│   └── input.js            # Input handling
├── sprites/                # Game sprite images
├── icons/                  # PWA icons
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
└── STRUCTURE.md            # Detailed code structure docs
```

### Code Organization
The game is built with a modular architecture:
- **Separation of Concerns** - Logic, rendering, and input are separated
- **9 Focused Modules** - Each handling specific functionality
- **~3,500 lines** of clean, documented code
- **Pixel-perfect collision** using alpha mask pre-computation

See [STRUCTURE.md](STRUCTURE.md) for detailed documentation.

## 🚀 Getting Started

### Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/todor96/picasso.git
   cd picasso
   ```

2. **Serve the files**
   
   Use any local server. Examples:
   
   **Python:**
   ```bash
   python -m http.server 8000
   ```
   
   **Node.js (http-server):**
   ```bash
   npx http-server
   ```
   
   **VS Code:**
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Install as PWA

1. Open the game in Chrome/Edge
2. Click the install icon in the address bar
3. Click "Install"
4. Play offline anytime!

## 🎨 Game Assets

All sprites are custom-designed:
- **Picasso** - The chef catching food
- **HRS** - Serbian grilled neck meat (+2 points)
- **SUS** - Serbian sausage (+2 points)
- **Muckalica** - Traditional stew (+1 point)
- **Pizza** - Deadly to catch (game over)

## 📊 Stats & Achievements

Track your progress with:
- Total catches
- Max score across all modes
- Longest combo
- Survival time
- Pizzas dodged
- Games played

Unlock achievements like:
- **First Catch** - Catch your first item
- **Combo Master** - Get a 10× combo
- **Centurion** - Score 100 points
- **Perfect 10** - Catch 10 in a row without missing
- And more!

## 🔧 Development

### Requirements
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Local web server (for testing)

### Modifying the Game

**Constants & Configuration:**
Edit `js/config.js` to adjust:
- Game speeds and difficulty
- Spawn rates
- Power-up durations
- Achievement conditions
- Game modes

**Visual Changes:**
- Sprites: Replace images in `/sprites/`
- UI: Modify rendering in `js/ui.js`
- Particles: Adjust effects in `js/particles.js`

**Game Logic:**
- Core mechanics: `js/game.js`
- Collision detection: `js/utils.js`
- Input handling: `js/input.js`

### Browser Compatibility
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Todor**
- GitHub: [@todor96](https://github.com/todor96)

## 🙏 Acknowledgments

- Serbian cuisine for the delicious inspiration
- HTML5 Canvas API for enabling browser games
- Web Audio API for dynamic sound generation

## 📝 Changelog

### v3.0 (Latest)
- ✨ Modular code architecture
- ✨ Change mode without restarting
- ✨ Improved pause menu
- 🐛 Fixed high score name entry
- 📚 Comprehensive documentation

### v2.0
- Added multiple game modes
- Power-up system
- Achievement system
- PWA support

### v1.0
- Initial release
- Basic catching gameplay

---

**Enjoy playing Picasso Catch! 🍖🎮**
