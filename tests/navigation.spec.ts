import { test, expect } from '@playwright/test';
import { HomePage } from '../pages';
import { DataReader } from '../utility';

test.describe('Navigation & Layout Tests', () => {
  let homePage: HomePage;
  let data: DataReader;

  test.beforeEach(async ({ page }) => {
    
    data = new DataReader('testdata.json');
    homePage = new HomePage(page);
    await homePage.open();
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC01 - All navigation menu items are visible', async () => {
    const isAllVisible = await homePage.verifyAllMenuItemsVisible();
    expect(isAllVisible).toBeTruthy();
  });


  test('TC02 - Markets link navigates correctly', async ({ page }) => {
    await homePage.clickNavItem('Markets');
    const expectedUrl = data.getString('expected.marketsUrl');
    await page.waitForURL(`**${expectedUrl}**`);
    expect(page.url()).toContain(expectedUrl);
  });

  test('TC03 - All submenu trading visible', async () => {
    await homePage.clickTradeMenu();
    const isAllVisible = await homePage.verifyTradeSubmenuVisible();
    expect(isAllVisible).toBeTruthy();
  });

  test('TC04 - All features submenu visible', async () => {
    await homePage.clickFeaturesMenu();
    const isAllVisible = await homePage.verifySubFeatureMenuVisible();
    expect(isAllVisible).toBeTruthy();
  });

  test('TC05 - All about us sub menu visible', async ({ page }) => {
    await homePage.clickAboutUs();
    const isAllVisible = await homePage.verifySubmenuAboutUs();
    expect(isAllVisible).toBeTruthy();
   
  });

    test('TC06 - Scroll and direct to appstore', async () => {
    await homePage.scrollToAppStore();
    await homePage.clickAppStore();
    await homePage.verifyNewTabUrl('expected.appstoreUrl');
  });

  test('TC07 - Scroll and direct to playstore', async () => {
    await homePage.scrollToPlayStore();
    await homePage.clickPlayStore();
    await homePage.verifyNewTabUrl('expected.playstoreUrl');
  });



  test('TC08 - validate about US multibank content', async ({page}) => {
    await homePage.clickWhyMultiBank();
    const result = await homePage.verifyAboutUsContent();
    if (!result.valid) console.log(result.errors);
      expect(result.valid, result.errors.join(', ')).toBeTruthy();
  });
});
