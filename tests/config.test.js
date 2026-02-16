import { describe, it, expect } from 'vitest';

describe('Game Configuration', () => {
  describe('Version and Constants', () => {
    it('should have a valid game version', () => {
      expect(GAME_VERSION).toBeDefined();
      expect(GAME_VERSION).toMatch(/^v\d+\.\d+$/);
    });

    it('should have valid player dimensions', () => {
      expect(PLAYER_WIDTH).toBeGreaterThan(0);
      expect(PLAYER_HEIGHT).toBeGreaterThan(0);
      expect(ITEM_SIZE).toBeGreaterThan(0);
    });

    it('should have sensible gameplay constants', () => {
      expect(PLAYER_SPEED).toBeGreaterThan(0);
      expect(INITIAL_FALL_SPEED).toBeGreaterThan(0);
      expect(INITIAL_SPAWN_INTERVAL).toBeGreaterThan(0);
      expect(MIN_SPAWN_INTERVAL).toBeGreaterThan(0);
      expect(MIN_SPAWN_INTERVAL).toBeLessThan(INITIAL_SPAWN_INTERVAL);
      expect(MAX_LIVES).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Food Types', () => {
    it('should have at least one food type', () => {
      expect(FOOD_TYPES).toBeDefined();
      expect(Array.isArray(FOOD_TYPES)).toBe(true);
      expect(FOOD_TYPES.length).toBeGreaterThan(0);
    });

    it('should have valid food type structure', () => {
      FOOD_TYPES.forEach(food => {
        expect(food).toHaveProperty('name');
        expect(food).toHaveProperty('points');
        expect(food).toHaveProperty('deadly');
        expect(typeof food.name).toBe('string');
        expect(typeof food.points).toBe('number');
        expect(typeof food.deadly).toBe('boolean');
      });
    });

    it('should have exactly one deadly food (pizza)', () => {
      const deadlyFoods = FOOD_TYPES.filter(f => f.deadly);
      expect(deadlyFoods.length).toBe(1);
      expect(deadlyFoods[0].name).toBe('pizza');
    });

    it('should have non-negative points for all foods', () => {
      FOOD_TYPES.forEach(food => {
        expect(food.points).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Power-up Types', () => {
    it('should have at least one power-up type', () => {
      expect(POWER_UP_TYPES).toBeDefined();
      expect(Array.isArray(POWER_UP_TYPES)).toBe(true);
      expect(POWER_UP_TYPES.length).toBeGreaterThan(0);
    });

    it('should have valid power-up structure', () => {
      POWER_UP_TYPES.forEach(powerUp => {
        expect(powerUp).toHaveProperty('type');
        expect(powerUp).toHaveProperty('color');
        expect(powerUp).toHaveProperty('duration');
        expect(powerUp).toHaveProperty('icon');
        expect(typeof powerUp.type).toBe('string');
        expect(typeof powerUp.color).toBe('string');
        expect(typeof powerUp.duration).toBe('number');
        expect(typeof powerUp.icon).toBe('string');
      });
    });

    it('should have valid hex colors for power-ups', () => {
      POWER_UP_TYPES.forEach(powerUp => {
        expect(powerUp.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it('should have non-negative durations', () => {
      POWER_UP_TYPES.forEach(powerUp => {
        expect(powerUp.duration).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Achievements', () => {
    it('should have at least one achievement', () => {
      expect(ACHIEVEMENTS).toBeDefined();
      expect(Array.isArray(ACHIEVEMENTS)).toBe(true);
      expect(ACHIEVEMENTS.length).toBeGreaterThan(0);
    });

    it('should have valid achievement structure', () => {
      ACHIEVEMENTS.forEach(achievement => {
        expect(achievement).toHaveProperty('id');
        expect(achievement).toHaveProperty('name');
        expect(achievement).toHaveProperty('desc');
        expect(achievement).toHaveProperty('check');
        expect(typeof achievement.id).toBe('string');
        expect(typeof achievement.name).toBe('string');
        expect(typeof achievement.desc).toBe('string');
        expect(typeof achievement.check).toBe('function');
      });
    });

    it('should have unique achievement IDs', () => {
      const ids = ACHIEVEMENTS.map(a => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid check functions', () => {
      const testStats = {
        totalCatches: 10,
        maxCombo: 15,
        maxScore: 150,
        maxSurvivalTime: 90,
        pizzasDodged: 10
      };

      ACHIEVEMENTS.forEach(achievement => {
        const result = achievement.check(testStats);
        expect(typeof result).toBe('boolean');
      });
    });
  });

  describe('Game Modes', () => {
    it('should have at least one game mode', () => {
      expect(GAME_MODES).toBeDefined();
      expect(typeof GAME_MODES).toBe('object');
      expect(Object.keys(GAME_MODES).length).toBeGreaterThan(0);
    });

    it('should have valid game mode structure', () => {
      Object.values(GAME_MODES).forEach(mode => {
        expect(mode).toHaveProperty('id');
        expect(mode).toHaveProperty('name');
        expect(mode).toHaveProperty('desc');
        expect(mode).toHaveProperty('icon');
        expect(mode).toHaveProperty('lives');
        expect(mode).toHaveProperty('powerUps');
        expect(mode).toHaveProperty('timeLimit');
        expect(mode).toHaveProperty('speedMultiplier');
        expect(typeof mode.id).toBe('string');
        expect(typeof mode.name).toBe('string');
        expect(typeof mode.desc).toBe('string');
        expect(typeof mode.icon).toBe('string');
        expect(typeof mode.powerUps).toBe('boolean');
        expect(typeof mode.speedMultiplier).toBe('number');
      });
    });

    it('should have positive speed multipliers', () => {
      Object.values(GAME_MODES).forEach(mode => {
        expect(mode.speedMultiplier).toBeGreaterThan(0);
      });
    });

    it('should have standard game modes', () => {
      expect(GAME_MODES).toHaveProperty('NORMAL');
      expect(GAME_MODES).toHaveProperty('ZEN');
      expect(GAME_MODES).toHaveProperty('TIME_ATTACK');
      expect(GAME_MODES).toHaveProperty('HARDCORE');
    });
  });

  describe('Sprite Names', () => {
    it('should have sprite names defined', () => {
      expect(SPRITE_NAMES).toBeDefined();
      expect(Array.isArray(SPRITE_NAMES)).toBe(true);
      expect(SPRITE_NAMES.length).toBeGreaterThan(0);
    });

    it('should include all food types in sprite names', () => {
      FOOD_TYPES.forEach(food => {
        expect(SPRITE_NAMES).toContain(food.name);
      });
    });

    it('should include player sprite', () => {
      expect(SPRITE_NAMES).toContain('picasso');
    });
  });
});
