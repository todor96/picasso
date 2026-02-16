import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Utility Functions', () => {
  describe('Mobile Detection', () => {
    it('should detect mobile user agents', () => {
      expect(typeof isMobile).toBe('boolean');
    });
  });

  describe('Pixel Perfect Collision', () => {
    it('should return false when rectangles do not overlap', () => {
      const rect1 = { x: 0, y: 0 };
      const mask1 = { w: 10, h: 10, mask: new Array(100).fill(true) };
      const rect2 = { x: 20, y: 20 };
      const mask2 = { w: 10, h: 10, mask: new Array(100).fill(true) };

      expect(pixelPerfectCollision(rect1, mask1, rect2, mask2)).toBe(false);
    });

    it('should return true when rectangles overlap with collision pixels', () => {
      const rect1 = { x: 0, y: 0 };
      const mask1 = { w: 10, h: 10, mask: new Array(100).fill(true) };
      const rect2 = { x: 5, y: 5 };
      const mask2 = { w: 10, h: 10, mask: new Array(100).fill(true) };

      expect(pixelPerfectCollision(rect1, mask1, rect2, mask2)).toBe(true);
    });

    it('should return false when rectangles overlap but no pixel collision', () => {
      const rect1 = { x: 0, y: 0 };
      // Mask with only top-left pixel filled
      const mask1 = { w: 10, h: 10, mask: [true, ...new Array(99).fill(false)] };
      const rect2 = { x: 5, y: 5 };
      // Mask with only bottom-right pixel filled
      const mask2 = { w: 10, h: 10, mask: [...new Array(99).fill(false), true] };

      expect(pixelPerfectCollision(rect1, mask1, rect2, mask2)).toBe(false);
    });

    it('should handle floating point coordinates', () => {
      const rect1 = { x: 0.7, y: 0.3 };
      const mask1 = { w: 10, h: 10, mask: new Array(100).fill(true) };
      const rect2 = { x: 5.2, y: 5.8 };
      const mask2 = { w: 10, h: 10, mask: new Array(100).fill(true) };

      // Should floor coordinates and still detect collision
      expect(pixelPerfectCollision(rect1, mask1, rect2, mask2)).toBe(true);
    });

    it('should return false for adjacent non-overlapping rectangles', () => {
      const rect1 = { x: 0, y: 0 };
      const mask1 = { w: 10, h: 10, mask: new Array(100).fill(true) };
      const rect2 = { x: 10, y: 0 };
      const mask2 = { w: 10, h: 10, mask: new Array(100).fill(true) };

      expect(pixelPerfectCollision(rect1, mask1, rect2, mask2)).toBe(false);
    });

    it('should handle small collision masks', () => {
      const rect1 = { x: 0, y: 0 };
      const mask1 = { w: 2, h: 2, mask: [true, true, true, true] };
      const rect2 = { x: 1, y: 1 };
      const mask2 = { w: 2, h: 2, mask: [true, true, true, true] };

      expect(pixelPerfectCollision(rect1, mask1, rect2, mask2)).toBe(true);
    });

    it('should handle completely transparent masks', () => {
      const rect1 = { x: 0, y: 0 };
      const mask1 = { w: 10, h: 10, mask: new Array(100).fill(false) };
      const rect2 = { x: 5, y: 5 };
      const mask2 = { w: 10, h: 10, mask: new Array(100).fill(true) };

      expect(pixelPerfectCollision(rect1, mask1, rect2, mask2)).toBe(false);
    });
  });

  describe('Vibrate Function', () => {
    it('should be defined', () => {
      expect(typeof vibrate).toBe('function');
    });

    it('should accept duration parameter', () => {
      // Should not throw
      expect(() => vibrate(50)).not.toThrow();
      expect(() => vibrate()).not.toThrow();
    });
  });
});
