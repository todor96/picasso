import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('PWA Manifest', () => {
  let manifest;

  it('should load and parse manifest.json', () => {
    const manifestPath = join(process.cwd(), 'manifest.json');
    const manifestContent = readFileSync(manifestPath, 'utf-8');
    expect(() => {
      manifest = JSON.parse(manifestContent);
    }).not.toThrow();
  });

  it('should have required fields', () => {
    const manifestPath = join(process.cwd(), 'manifest.json');
    const manifestContent = readFileSync(manifestPath, 'utf-8');
    manifest = JSON.parse(manifestContent);

    expect(manifest).toHaveProperty('name');
    expect(manifest).toHaveProperty('short_name');
    expect(manifest).toHaveProperty('description');
    expect(manifest).toHaveProperty('start_url');
    expect(manifest).toHaveProperty('display');
    expect(manifest).toHaveProperty('icons');
  });

  it('should have valid icon definitions', () => {
    const manifestPath = join(process.cwd(), 'manifest.json');
    const manifestContent = readFileSync(manifestPath, 'utf-8');
    manifest = JSON.parse(manifestContent);

    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThan(0);

    manifest.icons.forEach(icon => {
      expect(icon).toHaveProperty('src');
      expect(icon).toHaveProperty('sizes');
      expect(icon).toHaveProperty('type');
      expect(typeof icon.src).toBe('string');
      expect(typeof icon.sizes).toBe('string');
      expect(icon.type).toMatch(/^image\//);
    });
  });

  it('should have valid color values', () => {
    const manifestPath = join(process.cwd(), 'manifest.json');
    const manifestContent = readFileSync(manifestPath, 'utf-8');
    manifest = JSON.parse(manifestContent);

    if (manifest.background_color) {
      expect(manifest.background_color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
    if (manifest.theme_color) {
      expect(manifest.theme_color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('should have valid display mode', () => {
    const manifestPath = join(process.cwd(), 'manifest.json');
    const manifestContent = readFileSync(manifestPath, 'utf-8');
    manifest = JSON.parse(manifestContent);

    const validDisplayModes = ['fullscreen', 'standalone', 'minimal-ui', 'browser'];
    expect(validDisplayModes).toContain(manifest.display);
  });

  it('should have valid orientation', () => {
    const manifestPath = join(process.cwd(), 'manifest.json');
    const manifestContent = readFileSync(manifestPath, 'utf-8');
    manifest = JSON.parse(manifestContent);

    if (manifest.orientation) {
      const validOrientations = [
        'any', 'natural', 'landscape', 'portrait',
        'portrait-primary', 'portrait-secondary',
        'landscape-primary', 'landscape-secondary'
      ];
      expect(validOrientations).toContain(manifest.orientation);
    }
  });

  it('should include standard icon sizes (192 and 512)', () => {
    const manifestPath = join(process.cwd(), 'manifest.json');
    const manifestContent = readFileSync(manifestPath, 'utf-8');
    manifest = JSON.parse(manifestContent);

    const sizes = manifest.icons.map(icon => icon.sizes);
    const hasSizes = (size) => sizes.some(s => s.includes(size));

    expect(hasSizes('192')).toBe(true);
    expect(hasSizes('512')).toBe(true);
  });
});
