/**
 * Test Setup - Load global variables from game modules
 * This setup file is run before all tests to make game globals available
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Read and evaluate config.js to get global constants
const configPath = join(process.cwd(), 'js', 'config.js');
const configContent = readFileSync(configPath, 'utf-8');

// Read and evaluate utils.js to get utility functions
const utilsPath = join(process.cwd(), 'js', 'utils.js');
const utilsContent = readFileSync(utilsPath, 'utf-8');

// Create a safe evaluation context
// We'll extract the constants and functions and make them globally available
// This is a simple approach - in production you might use a proper module system

try {
  // Create a wrapper to capture the constants and functions
  // and assign them to globalThis
  const configWrapper = `
    ${configContent}
    // Assign to globalThis
    globalThis.GAME_VERSION = GAME_VERSION;
    globalThis.PLAYER_WIDTH = PLAYER_WIDTH;
    globalThis.PLAYER_HEIGHT = PLAYER_HEIGHT;
    globalThis.ITEM_SIZE = ITEM_SIZE;
    globalThis.PLAYER_SPEED = PLAYER_SPEED;
    globalThis.INITIAL_FALL_SPEED = INITIAL_FALL_SPEED;
    globalThis.INITIAL_SPAWN_INTERVAL = INITIAL_SPAWN_INTERVAL;
    globalThis.DIFFICULTY_INTERVAL = DIFFICULTY_INTERVAL;
    globalThis.SPEED_INCREMENT = SPEED_INCREMENT;
    globalThis.SPAWN_DECREMENT = SPAWN_DECREMENT;
    globalThis.MIN_SPAWN_INTERVAL = MIN_SPAWN_INTERVAL;
    globalThis.MAX_LIVES = MAX_LIVES;
    globalThis.FOOD_TYPES = FOOD_TYPES;
    globalThis.POWER_UP_TYPES = POWER_UP_TYPES;
    globalThis.ACHIEVEMENTS = ACHIEVEMENTS;
    globalThis.GAME_MODES = GAME_MODES;
    globalThis.SPRITE_NAMES = SPRITE_NAMES;
  `;
  
  const utilsWrapper = `
    ${utilsContent}
    // Assign to globalThis
    globalThis.isMobile = isMobile;
    globalThis.vibrate = vibrate;
    globalThis.pixelPerfectCollision = pixelPerfectCollision;
  `;
  
  // Execute config.js wrapper
  eval(configWrapper);
  // Execute utils.js wrapper  
  eval(utilsWrapper);
} catch (error) {
  console.warn('Warning: Could not load game modules for testing:', error.message);
}
