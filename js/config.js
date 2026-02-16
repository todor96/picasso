// ─── Game Configuration ───
const GAME_VERSION = 'v3.0';

// Player & Item sizes
const PLAYER_WIDTH = 100;
const PLAYER_HEIGHT = 100;
const ITEM_SIZE = 65;

// Gameplay constants
const PLAYER_SPEED = 7;
const INITIAL_FALL_SPEED = 2.5;
const INITIAL_SPAWN_INTERVAL = 1200; // ms
const DIFFICULTY_INTERVAL = 15000;   // ramp every 15s
const SPEED_INCREMENT = 0.4;
const SPAWN_DECREMENT = 80;          // ms faster spawn
const MIN_SPAWN_INTERVAL = 400;
const MAX_LIVES = 3;

// Food types
const FOOD_TYPES = [
  { name: 'hrs',       points: 2, deadly: false, isHeart: false },
  { name: 'sus',       points: 2, deadly: false, isHeart: false },
  { name: 'muckalica', points: 1, deadly: false, isHeart: false },
  { name: 'pizza',     points: 0, deadly: true,  isHeart: false },
  { name: 'heart',     points: 0, deadly: false, isHeart: true  },
];

// Power-up types
const POWER_UP_TYPES = [
  { type: 'shield', color: '#4ECDC4', duration: 10000, icon: '🛡️' },
  { type: 'slowmo', color: '#95E1D3', duration: 5000, icon: '⏱️' },
  { type: 'magnet', color: '#F38181', duration: 7000, icon: '🧲' },
  { type: 'double', color: '#FFD93D', duration: 10000, icon: '2×' },
];

// Achievements
const ACHIEVEMENTS = [
  { id: 'first_catch', name: 'First Catch', desc: 'Catch your first item', check: s => s.totalCatches >= 1 },
  { id: 'combo_5', name: 'Combo Starter', desc: 'Get a 5× combo', check: s => s.maxCombo >= 5 },
  { id: 'combo_10', name: 'Combo Master', desc: 'Get a 10× combo', check: s => s.maxCombo >= 10 },
  { id: 'score_50', name: 'Half Century', desc: 'Score 50 points', check: s => s.maxScore >= 50 },
  { id: 'score_100', name: 'Centurion', desc: 'Score 100 points', check: s => s.maxScore >= 100 },
  { id: 'survive_60', name: 'One Minute', desc: 'Survive 60 seconds', check: s => s.maxSurvivalTime >= 60 },
  { id: 'pizza_dodge', name: 'Pizza Dodger', desc: 'Let 5 pizzas fall', check: s => s.pizzasDodged >= 5 },
  { id: 'no_miss_10', name: 'Perfect 10', desc: 'Catch 10 in a row without missing', check: s => s.maxCombo >= 10 },
];

// Game Modes
const GAME_MODES = {
  NORMAL: {
    id: 'normal',
    name: 'Normal',
    desc: 'Classic gameplay with lives and power-ups',
    icon: '🎮',
    lives: 3,
    powerUps: true,
    timeLimit: null,
    speedMultiplier: 1
  },
  ZEN: {
    id: 'zen',
    name: 'Zen Mode',
    desc: 'Relaxing endless mode - no lives, no pressure',
    icon: '🧘',
    lives: Infinity,
    powerUps: true,
    timeLimit: null,
    speedMultiplier: 0.7
  },
  TIME_ATTACK: {
    id: 'time',
    name: 'Time Attack',
    desc: '60 seconds - get the highest score possible!',
    icon: '⏱️',
    lives: Infinity,
    powerUps: true,
    timeLimit: 60000,
    speedMultiplier: 1.2
  },
  HARDCORE: {
    id: 'hardcore',
    name: 'Hardcore',
    desc: 'Fast from the start, no power-ups, 2 lives',
    icon: '💀',
    lives: 2,
    powerUps: false,
    timeLimit: null,
    speedMultiplier: 1.5
  }
};

// Sprite names for loading
const SPRITE_NAMES = ['picasso', 'hrs', 'sus', 'muckalica', 'pizza'];
