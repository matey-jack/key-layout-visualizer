import { test } from '@playwright/test';

test('capture page state and screenshot', async ({ page }) => {
  // Set a generous test timeout just in case
  test.setTimeout(45000);
  
  const targetUrl = 'http://localhost:3000/key-layout-visualizer/#layout=0&midShift=1&mapping=QWERTY&viz=4&split=0&wide=0&ansi=0&thumbsUp16=0&angle=0';
  console.log(`Navigating to: ${targetUrl}`);
  
  await page.goto(targetUrl);
  
  // Wait for the SVG to render (max 5 seconds)
  console.log('Waiting for SVG to render...');
  await page.waitForSelector('svg', { timeout: 5000 });
  await page.waitForTimeout(500);

  // Take the screenshot immediately so we guarantee we get it even if subsequent queries timeout
  const screenshotPath = 'C:\\Users\\beaut\\.gemini\\antigravity\\brain\\9d3d755f-407b-4ccc-a1e2-c3d48f0dd601\\screenshot.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot successfully saved to: ${screenshotPath}`);

  // Query details with a very short timeout (1 second) so they never cause long hangs
  const pageTitle = await page.title().catch(() => 'Unknown');
  const selectedMapping = await page.locator('table.mapping-list tbody tr.selected').first().textContent({ timeout: 1000 }).catch(() => 'None');
  const activeLayoutTab = await page.locator('.top-bar-keyboard-tab-label.active, .layout-type-button.active, .active').first().textContent({ timeout: 1000 }).catch(() => 'None');
  const activeVizButton = await page.locator('.viz-type-button.active, .active').first().textContent({ timeout: 1000 }).catch(() => 'None');
  
  console.log(`--- Page Info ---`);
  console.log(`Title: ${pageTitle}`);
  console.log(`Selected Mapping: ${selectedMapping?.trim().replace(/\s+/g, ' ')}`);
  console.log(`Active Layout Tab: ${activeLayoutTab?.trim()}`);
  console.log(`Active Viz Button: ${activeVizButton?.trim()}`);
  
  const keyLabels = await page.locator('svg text').allTextContents().catch(() => []);
  console.log(`Found ${keyLabels.length} key labels in SVG.`);
  if (keyLabels.length > 0) {
    console.log(`First 15 labels: ${keyLabels.slice(0, 15).join(', ')}`);
  }
});
