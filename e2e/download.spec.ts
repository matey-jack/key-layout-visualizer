/**
 * E2E tests for SVG download functionality.
 * Tests verify that:
 * - SVG downloads with correct filename format
 * - SVG contains valid structure and embedded styles
 * - CSS styling includes only KeyboardSvg.css rules (no page layout styles)
 * - All visualization types can be exported
 */

import {expect, test} from '@playwright/test';
import * as fs from 'fs';

test.describe('SVG Download', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/key-layout-visualizer/');
  });

  test('should download SVG with correct filename format', async ({ page, context }) => {
    // Wait for the SVG to be rendered
    await page.waitForSelector('svg.keyboard-svg', { timeout: 5000 });
    
    // Listen for download event
    const downloadPromise = page.waitForEvent('download');
    
    // Click the download SVG link
    const downloadLink = page.locator('a.download-svg-link');
    await expect(downloadLink).toBeVisible();
    await downloadLink.click();
    
    // Get the download
    const download = await downloadPromise;
    const filename = download.suggestedFilename();
    
    // Verify filename format: {keymapName}-{layoutName}.svg
    expect(filename).toMatch(/\.svg$/);
    expect(filename).toMatch(/-/);
  });

  test('should produce valid SVG with embedded styles', async ({ page, context }) => {
    await page.waitForSelector('svg.keyboard-svg', { timeout: 5000 });
    
    const downloadPromise = page.waitForEvent('download');
    await page.locator('a.download-svg-link').click();
    const download = await downloadPromise;
    
    // Save to temporary location
    const tempPath = 'temp-download.svg';
    await download.saveAs(tempPath);
    
    try {
      // Read the file
      const content = fs.readFileSync(tempPath, 'utf-8');
      
      // Verify it's valid XML/SVG
      expect(content).toContain('<svg');
      expect(content).toContain('</svg>');
      expect(content).toContain('xmlns="http://www.w3.org/2000/svg"');
      
      // Verify embedded styles
      expect(content).toContain('<style>');
      expect(content).toContain('</style>');
      
      // Extract and verify style content
      const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
      expect(styleMatch).toBeTruthy();
      const styleContent = styleMatch?.[1] || '';
      expect(styleContent.length).toBeGreaterThan(100);
      
      // Verify it contains SVG-relevant CSS classes
      expect(styleContent).toMatch(/\.key-/);
      expect(styleContent).toMatch(/\.keyboard-/);
      
    } finally {
      // Clean up
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  });

  test('should include SVG elements with proper classes', async ({ page, context }) => {
    await page.waitForSelector('svg.keyboard-svg', { timeout: 5000 });
    
    const downloadPromise = page.waitForEvent('download');
    await page.locator('a.download-svg-link').click();
    const download = await downloadPromise;
    
    const tempPath = 'temp-download.svg';
    await download.saveAs(tempPath);
    
    try {
      const content = fs.readFileSync(tempPath, 'utf-8');
      
      // Verify key SVG elements are present
      expect(content).toContain('<g');
      expect(content).toContain('<rect');
      expect(content).toContain('<text');
      
      // Verify key classes are present in elements
      expect(content).toContain('class="key-group');
      expect(content).toContain('class="key-outline');
      expect(content).toContain('class="key-label');
      
    } finally {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  });

  test('should have KeyboardSvg.css styles in export', async ({ page, context }) => {
    await page.waitForSelector('svg.keyboard-svg', { timeout: 5000 });
    
    const downloadPromise = page.waitForEvent('download');
    await page.locator('a.download-svg-link').click();
    const download = await downloadPromise;
    
    const tempPath = 'temp-download.svg';
    await download.saveAs(tempPath);
    
    try {
      const content = fs.readFileSync(tempPath, 'utf-8');
      const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
      const styleContent = styleMatch?.[1] || '';
      
      // Verify fingering colors are present
      expect(styleContent).toMatch(/\.lthumb\s*\{.*fill/);
      expect(styleContent).toMatch(/\.rindex\s*\{.*fill/);
      expect(styleContent).toMatch(/\.pinky\s*\{.*fill/);
      
      // Verify effort colors are present
      expect(styleContent).toMatch(/\.effort-\d+\s*\{.*fill/);
      
      // Verify key outline styling
      expect(styleContent).toMatch(/\.key-outline\s*\{.*fill/);
      
    } finally {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  });

  test('should not include page layout styles in export', async ({ page, context }) => {
    await page.waitForSelector('svg.keyboard-svg', { timeout: 5000 });
    
    const downloadPromise = page.waitForEvent('download');
    await page.locator('a.download-svg-link').click();
    const download = await downloadPromise;
    
    const tempPath = 'temp-download.svg';
    await download.saveAs(tempPath);
    
    try {
      const content = fs.readFileSync(tempPath, 'utf-8');
      const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
      const styleContent = styleMatch?.[1] || '';
      
      // Verify page layout styles are NOT present
      expect(styleContent).not.toContain('mapping-and-details-container');
      expect(styleContent).not.toContain('layout-top-bar');
      expect(styleContent).not.toContain('visualization-switches');
      
      // Verify HTML-specific properties are minimal/not present
      // (some might be okay if they're in the KeyboardSvg.css, but there shouldn't be many)
      const backgroundColorCount = (styleContent.match(/background-color/g) || []).length;
      const paddingCount = (styleContent.match(/\bpadding\b/g) || []).length;
      expect(backgroundColorCount).toBeLessThan(5);
      expect(paddingCount).toBeLessThan(5);
      
    } finally {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  });

  test('should export SVG for different visualization types', async ({ page, context }) => {
    // Get all visualization type buttons
    const vizTypeButtons = page.locator('button.viz-type-button');
    const count = await vizTypeButtons.count();
    
    // Test with first 3 visualization types (to keep test time reasonable)
    for (let i = 0; i < Math.min(3, count); i++) {
      const button = vizTypeButtons.nth(i);
      await button.click();
      await page.waitForLoadState('networkidle');
      
      // Verify SVG is visible
      const svgElement = page.locator('svg.keyboard-svg');
      await expect(svgElement).toBeVisible();
      
      // Try to download
      const downloadPromise = page.waitForEvent('download');
      await page.locator('a.download-svg-link').click();
      const download = await downloadPromise;
      
      const tempPath = `temp-download-${i}.svg`;
      await download.saveAs(tempPath);
      
      try {
        const content = fs.readFileSync(tempPath, 'utf-8');
        
        // Basic SVG validity checks
        expect(content).toContain('<svg');
        expect(content).toContain('</svg>');
        expect(content).toContain('<style>');
        expect(content).toContain('</style>');
        expect(content.length).toBeGreaterThan(1000);
        
      } finally {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      }
    }
  });

  test('should preserve key element attributes in SVG', async ({ page, context }) => {
    await page.waitForSelector('svg.keyboard-svg', { timeout: 5000 });
    
    const downloadPromise = page.waitForEvent('download');
    await page.locator('a.download-svg-link').click();
    const download = await downloadPromise;
    
    const tempPath = 'temp-download.svg';
    await download.saveAs(tempPath);
    
    try {
      const content = fs.readFileSync(tempPath, 'utf-8');
      
      // Verify elements have necessary SVG attributes
      // Groups should have transform or other positioning
      expect(content).toMatch(/<g[^>]*(class|style|transform)[^>]*>/);
      
      // Rectangles should have dimensions
      expect(content).toMatch(/<rect[^>]*width=/);
      expect(content).toMatch(/<rect[^>]*height=/);
      
      // Text elements should be present
      expect(content).toMatch(/<text[^>]*x=/);
      expect(content).toMatch(/<text[^>]*y=/);
      
    } finally {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  });
});
