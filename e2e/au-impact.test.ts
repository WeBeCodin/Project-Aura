import { test, expect } from '@playwright/test';

test.describe('AU Impact Hub', () => {
  test('View Impact Hub', async ({ page }) => {
    // Navigate to /au/impact
    await page.goto('/au/impact');
    
    // Verify page loads
    await expect(page).toHaveTitle(/AU Impact Hub/);
    
    // Verify three tabs are visible
    const tabs = page.getByTestId('opportunity-tabs');
    await expect(tabs).toBeVisible();
    
    const jobsTab = page.getByTestId('jobs-tab');
    const tendersTab = page.getByTestId('tenders-tab');
    const grantsTab = page.getByTestId('grants-tab');
    
    await expect(jobsTab).toBeVisible();
    await expect(tendersTab).toBeVisible();
    await expect(grantsTab).toBeVisible();
    
    // Verify listings are displayed
    const opportunityList = page.getByTestId('opportunity-list');
    await expect(opportunityList).toBeVisible();
    
    // Check that at least one opportunity is displayed
    const opportunityCards = page.getByTestId('opportunity-card');
    const count = await opportunityCards.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify each listing clearly shows type
    const types = page.getByTestId('opportunity-type');
    await expect(types.first()).toBeVisible();
    
    // Verify regional Australian locations are shown
    const locations = page.getByTestId('opportunity-location');
    await expect(locations.first()).toBeVisible();
  });

  test('Find Training Tender', async ({ page }) => {
    // Navigate to Impact Hub
    await page.goto('/au/impact');
    
    // Click Tenders tab
    const tendersTab = page.getByTestId('tenders-tab');
    await tendersTab.click();
    
    // Wait for results to load
    await page.waitForTimeout(1000);
    
    // Verify only tenders are shown
    const opportunityList = page.getByTestId('opportunity-list');
    await expect(opportunityList).toBeVisible();
    
    // Check that opportunities are displayed
    const opportunityCards = page.getByTestId('opportunity-card');
    const count = await opportunityCards.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify all visible items are tenders
    const types = page.getByTestId('opportunity-type');
    const typeTexts = await types.allTextContents();
    for (const text of typeTexts) {
      expect(text).toContain('TENDERS');
    }
    
    // Verify regional locations are displayed
    const locations = page.getByTestId('opportunity-location');
    await expect(locations.first()).toBeVisible();
  });

  test('Switch between tabs', async ({ page }) => {
    await page.goto('/au/impact');
    
    // Jobs tab (default)
    let types = page.getByTestId('opportunity-type');
    let typeTexts = await types.allTextContents();
    expect(typeTexts.some(t => t.includes('JOBS'))).toBeTruthy();
    
    // Switch to Tenders
    const tendersTab = page.getByTestId('tenders-tab');
    await tendersTab.click();
    await page.waitForTimeout(1000);
    
    types = page.getByTestId('opportunity-type');
    typeTexts = await types.allTextContents();
    expect(typeTexts.some(t => t.includes('TENDERS'))).toBeTruthy();
    
    // Switch to Grants
    const grantsTab = page.getByTestId('grants-tab');
    await grantsTab.click();
    await page.waitForTimeout(1000);
    
    types = page.getByTestId('opportunity-type');
    typeTexts = await types.allTextContents();
    expect(typeTexts.some(t => t.includes('GRANTS'))).toBeTruthy();
  });

  test('Verify regional focus', async ({ page }) => {
    await page.goto('/au/impact');
    
    // Check locations are regional (not major metros)
    const locations = page.getByTestId('opportunity-location');
    const locationTexts = await locations.allTextContents();
    
    // At least one location should be visible
    expect(locationTexts.length).toBeGreaterThan(0);
    
    // Verify locations show Australian regions
    for (const text of locationTexts) {
      // Should contain location indicator
      expect(text).toContain('📍');
    }
  });
});
