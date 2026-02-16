import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { join } from 'path';

describe('Sprite Assets', () => {
  describe('Sprite Files', () => {
    it('should have all required sprite files', () => {
      const spriteNames = ['picasso', 'hrs', 'sus', 'muckalica', 'pizza'];
      
      spriteNames.forEach(spriteName => {
        const spritePath = join(process.cwd(), 'sprites', `${spriteName}.png`);
        expect(existsSync(spritePath), `Sprite ${spriteName}.png should exist`).toBe(true);
      });
    });

    it('should have background sprite', () => {
      const bgPath = join(process.cwd(), 'sprites', 'bg.png');
      expect(existsSync(bgPath), 'Background sprite bg.png should exist').toBe(true);
    });
  });

  describe('Icon Assets', () => {
    it('should have required icon files', () => {
      const iconSizes = ['192', '512'];
      
      iconSizes.forEach(size => {
        const iconPath = join(process.cwd(), 'icons', `icon-${size}.png`);
        expect(existsSync(iconPath), `Icon icon-${size}.png should exist`).toBe(true);
      });
    });
  });

  describe('Asset Consistency', () => {
    it('should have sprites for all defined food types', () => {
      // FOOD_TYPES is defined globally in config.js
      if (typeof FOOD_TYPES !== 'undefined') {
        FOOD_TYPES.forEach(food => {
          const spritePath = join(process.cwd(), 'sprites', `${food.name}.png`);
          expect(existsSync(spritePath), `Sprite for food type ${food.name} should exist`).toBe(true);
        });
      }
    });

    it('should have sprite for player character', () => {
      const playerSpritePath = join(process.cwd(), 'sprites', 'picasso.png');
      expect(existsSync(playerSpritePath), 'Player sprite picasso.png should exist').toBe(true);
    });
  });
});
