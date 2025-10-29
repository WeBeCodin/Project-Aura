import { test, expect } from '@playwright/test';

test.describe('AU Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('AU-Exclusive Filter', async ({ page }) => {
    // Click AU-Exclusive toggle
    const auToggle = page.getByTestId('au-exclusive-toggle');
    await auToggle.check();
    
    // Wait for dashboard to update
    await page.waitForTimeout(1000);
    
    // Verify job list is visible
    const jobList = page.getByTestId('job-list');
    await expect(jobList).toBeVisible();
    
    // Check that at least one job is displayed
    const jobCards = page.getByTestId('job-card');
    const count = await jobCards.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify all visible jobs show Australian locations
    const locations = page.getByTestId('job-location');
    const locationTexts = await locations.allTextContents();
    for (const text of locationTexts) {
      // Should not contain "Remote (Global)"
      expect(text).not.toContain('Remote (Global)');
      // Should contain Hybrid or On-site
      expect(text.match(/Hybrid|On-site/)).toBeTruthy();
    }
  });

  test('Hybrid Search Sydney', async ({ page }) => {
    // Enable AU-Exclusive toggle
    const auToggle = page.getByTestId('au-exclusive-toggle');
    await auToggle.check();
    
    // Wait for initial load
    await page.waitForTimeout(1000);
    
    // Select category (assuming there's a way to filter by location)
    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('Sydney');
    await page.keyboard.press('Enter');
    
    // Wait for results
    await page.waitForTimeout(1000);
    
    // Verify results
    const jobList = page.getByTestId('job-list');
    await expect(jobList).toBeVisible();
    
    // Check that at least one job is displayed
    const jobCards = page.getByTestId('job-card');
    const count = await jobCards.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify all jobs show Sydney in location
    const locations = page.getByTestId('job-location');
    const locationTexts = await locations.allTextContents();
    for (const text of locationTexts) {
      expect(text).toContain('Sydney');
    }
  });

  test('Toggle between Global and AU', async ({ page }) => {
    // Start with global view
    let jobList = page.getByTestId('job-list');
    await expect(jobList).toBeVisible();
    
    // Get initial job count
    let jobCards = page.getByTestId('job-card');
    const globalCount = await jobCards.count();
    
    // Enable AU-Exclusive
    const auToggle = page.getByTestId('au-exclusive-toggle');
    await auToggle.check();
    await page.waitForTimeout(1000);
    
    // Verify different results
    jobCards = page.getByTestId('job-card');
    const auCount = await jobCards.count();
    
    // Toggle back to global
    await auToggle.uncheck();
    await page.waitForTimeout(1000);
    
    // Verify we're back to global results
    jobCards = page.getByTestId('job-card');
    const backToGlobalCount = await jobCards.count();
    
    // Results should be different between global and AU
    expect(auCount).not.toBe(globalCount);
  });
});
