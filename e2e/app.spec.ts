import {expect, test} from '@playwright/test';

test.describe('Keyboard Layout Visualizer', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    // Set up global error collection for all tests
    (page as any).consoleErrors = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const errorEntry = {
          text: msg.text(),
          args: msg.args(),
          location: msg.location(),
          type: msg.type(),
        };
        (page as any).consoleErrors.push(errorEntry);
        console.error(`[Browser Console Error]: ${msg.text()}`);
      }
    });

    page.on('pageerror', (error) => {
      const errorEntry = {
        test: testInfo.title,
        text: error.message,
        stack: error.stack,
        type: 'pageerror',
      };
      (page as any).consoleErrors.push(errorEntry);
      console.error(`[${testInfo.title}]Page Error: ${error.message}\n${error.stack}`);
    });

    await page.goto('/key-layout-visualizer/');
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Fail the test if any console errors were collected
    const errors = (page as any).consoleErrors || [];
    if (errors.length > 0) {
      console.error(`\n${'='.repeat(60)}`);
      console.error(`Test: ${testInfo.title}`);
      console.error(`${errors.length} console error(s) detected:`);
      console.error('='.repeat(60));
      
      errors.forEach((error, index) => {
        console.error(`\nError ${index + 1}, Test '${error.test}':`);
        console.error(`Type: ${error.type}`);
        console.error(`Message: ${error.text}`);
        if (error.stack) {
          console.error(`Stack: ${error.stack}`);
        }
      });
      console.error(`${'='.repeat(60)}\n`);
      
      expect(errors).toHaveLength(0);
    }
  });

  test('should have all three main areas present', async ({ page }) => {
    // Layout Area - contains the keyboard SVG and layout controls
    const layoutArea = page.locator('div').filter({ has: page.locator('svg') }).first();
    await expect(layoutArea).toBeVisible();

    // Mapping List Area - contains the table with mappings
    const mappingTable = page.locator('table.mapping-list');
    await expect(mappingTable).toBeVisible();

    // Details Area - shows layout/mapping description and visualization details
    const detailsArea = page.locator('.layout-description, .mapping-summary').first();
    await expect(detailsArea).toBeVisible();
  });

  test('should have mappings present in the list', async ({ page }) => {
    const mappingRows = page.locator('table.mapping-list tbody tr');
    const count = await mappingRows.count();
    expect(count).toBeGreaterThan(0);

    // Check that mapping names are present
    const firstMappingName = mappingRows.first().locator('td').first();
    await expect(firstMappingName).toContainText(/\S/);
  });

  test('should have all layout type buttons', async ({ page }) => {
    const layoutTypeButtons = page.locator('button.top-bar-keyboard-tab-label');
    const buttonTexts = await layoutTypeButtons.allTextContents();

    expect(buttonTexts.length).toBeGreaterThanOrEqual(3);
    const textContent = buttonTexts.map(t => t.toLowerCase());
    expect(textContent).toEqual(
      expect.arrayContaining(['ansi / typewriter', 'harmonic family', 'ergoplank / katana'])
    );
  });

  test('should have all visualization type buttons', async ({ page }) => {
    const vizTypeButtons = page.locator('button.viz-type-button');
    const buttonTexts = await vizTypeButtons.allTextContents();

    // Should have at least layout visualizations (Key Sizes, Fingering, Angle, Single-Key Effort)
    // and mapping visualizations (Learning, Letter Frequency, Bigram Effort)
    expect(buttonTexts.length).toBeGreaterThanOrEqual(6);
    
    const textContent = buttonTexts.map(t => t.toLowerCase());
    expect(textContent).toEqual(
      expect.arrayContaining([
        'key sizes',
        'fingering',
        'angle',
        'single-key effort',
        'learning',
        'letter frequency',
        'bigram effort'
      ])
    );
  });

  test('should handle layout type switching without errors', async ({ page }) => {
    // Get all layout type buttons
    const layoutTypeButtons = page.locator('button.top-bar-keyboard-tab-label');
    const count = await layoutTypeButtons.count();

    // Click each layout type button
    for (let i = 0; i < count; i++) {
      const button = layoutTypeButtons.nth(i);
      await button.click();
      await page.waitForLoadState('networkidle');
    }
    // Errors will be caught in afterEach hook
  });

  test('should handle visualization type switching without errors', async ({ page }) => {
    // Get all visualization type buttons
    const vizTypeButtons = page.locator('button.viz-type-button');
    const count = await vizTypeButtons.count();

    // Click each visualization button
    for (let i = 0; i < count; i++) {
      const button = vizTypeButtons.nth(i);
      await button.click();
      await page.waitForLoadState('networkidle');
    }
    // Errors will be caught in afterEach hook
  });

  test('should handle mapping selection without errors', async ({ page }) => {
    // Get all mapping rows
    const mappingRows = page.locator('table.mapping-list tbody tr');
    const count = await mappingRows.count();

    // Click first 3 mappings (limit to avoid long test)
    const clickCount = Math.min(3, count);
    for (let i = 0; i < clickCount; i++) {
      const row = mappingRows.nth(i);
      await row.click();
      await page.waitForLoadState('networkidle');
    }
    // Errors will be caught in afterEach hook
  });

  test('should handle show all mappings toggle without errors', async ({ page }) => {
    // Find and click the "show all mappings" checkbox by label
    const checkbox = page.locator('input[type="checkbox"]').filter({ has: page.locator('label:has-text("show all mappings")') }).first();
    // Fallback approach if the above doesn't work - find by the label text
    const checkboxByLabel = page.getByRole('checkbox', { name: /show all mappings/ });
    const targetCheckbox = await checkboxByLabel.isVisible() ? checkboxByLabel : checkbox;
    
    await targetCheckbox.click();
    await page.waitForLoadState('networkidle');

    // Toggle it back
    await targetCheckbox.click();
    await page.waitForLoadState('networkidle');
    // Errors will be caught in afterEach hook
  });

  test('should not have any console errors on initial load', async ({ page }) => {
    // Just wait for network idle - errors will be caught by afterEach hook
    await page.waitForLoadState('networkidle');
  });

  test('should maintain selected state when switching layout types', async ({ page }) => {
    // Select a specific mapping first
    const mappingRow = page.locator('table.mapping-list tbody tr').first();
    await mappingRow.click();

    // Click a layout type button
    const layoutButton = page.locator('button.top-bar-keyboard-tab-label').nth(1);
    await layoutButton.click();
    await page.waitForLoadState('networkidle');

    // Check that a mapping is still selected
    const selectedRow = page.locator('table.mapping-list tbody tr.selected');
    await expect(selectedRow).toBeVisible();
  });

  test('should show visualization switching changes the displayed content', async ({ page }) => {
    // Get initial visualization detail content
    const detailsArea = page.locator('.visualization-details');
    const initialText = await detailsArea.textContent();

    // Switch to a different visualization
    const vizButtons = page.locator('button.viz-type-button');
    const secondButton = vizButtons.nth(0);
    await secondButton.click();
    await page.waitForLoadState('networkidle');

    // This is a weak assertion but shows the UI is responding
    await expect(detailsArea).toBeVisible();
    // Get new visualization detail content
    const newText = await detailsArea.textContent();
    // They should be different (unless we happened to click the same category)
    expect(newText).not.toEqual(initialText);
  });

  test('should render keyboard visualization for each layout type', async ({ page }) => {
    const layoutTypeButtons = page.locator('button.top-bar-keyboard-tab-label');
    const count = await layoutTypeButtons.count();

    for (let i = 0; i < count; i++) {
      const button = layoutTypeButtons.nth(i);
      await button.click();
      await page.waitForLoadState('networkidle');

      // Check that SVG keyboard is visible
      const keyboard = page.locator('svg');
      await expect(keyboard.first()).toBeVisible();
    }
  });
});
