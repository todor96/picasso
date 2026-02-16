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

// For now, we'll use eval in a controlled way to load the game constants
// This works because config.js and utils.js use const declarations

try {
  // Execute config.js in global scope
  eval(configContent);
  // Execute utils.js in global scope  
  eval(utilsContent);
} catch (error) {
  console.warn('Warning: Could not load game modules for testing:', error.message);
}
