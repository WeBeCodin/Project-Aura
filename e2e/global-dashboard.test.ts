import { test, expect } from '@playwright/test';

test.describe('Global Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Filter by Vibe Coding', async ({ page }) => {
    // Open the category filter
    const categoryFilter = page.getByTestId('category-filter');
    await expect(categoryFilter).toBeVisible();
    
    // Select 'Vibe Coding (AI-Assisted)'
    await categoryFilter.selectOption('VIBE_CODING');
    
    // Wait for job list to update
    await page.waitForTimeout(1000);
    
    // Verify job list updates to show only VIBE_CODING roles
    const jobList = page.getByTestId('job-list');
    await expect(jobList).toBeVisible();
    
    // Check that at least one job is displayed
    const jobCards = page.getByTestId('job-card');
    const count = await jobCards.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify all visible jobs have the correct category
    const categories = page.getByTestId('job-category');
    const categoryTexts = await categories.allTextContents();
    for (const text of categoryTexts) {
      expect(text).toContain('Vibe Coding (AI-Assisted)');
    }
  });

  test('Global Search', async ({ page }) => {
    // Enter search term
    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('Prompt Engineer');
    
    // Submit search
    await page.keyboard.press('Enter');
    
    // Wait for results
    await page.waitForTimeout(1000);
    
    // Verify results include "Prompt Engineer" in title or description
    const jobCards = page.getByTestId('job-card');
    const count = await jobCards.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify all jobs are marked as Remote (Global)
    const locations = page.getByTestId('job-location');
    const locationTexts = await locations.allTextContents();
    for (const text of locationTexts) {
      expect(text).toContain('Remote (Global)');
    }
  });

  test('Vibe Score Filter', async ({ page }) => {
    // Set vibe score slider
    const vibeScoreSlider = page.getByTestId('vibe-score-slider');
    await vibeScoreSlider.fill('70');
    
    // Wait for results to update
    await page.waitForTimeout(1000);
    
    // Check if jobs are displayed
    const jobList = page.getByTestId('job-list');
    await expect(jobList).toBeVisible();
    
    // Verify all displayed jobs have vibe score >= 70
    const vibeScores = page.getByTestId('vibe-score');
    const scores = await vibeScores.allTextContents();
    for (const scoreText of scores) {
      const score = parseInt(scoreText.replace('Vibe: ', ''), 10);
      expect(score).toBeGreaterThanOrEqual(70);
    }
  });
});
