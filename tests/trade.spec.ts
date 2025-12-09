import { test, expect } from '@playwright/test';
import { TradingPage} from '../pages/Trade';
import { HomePage } from '../pages';
import { DataReader } from '../utility';

test.describe('Trading Spot Tests', () => {
  let tradingPage: TradingPage;
  let homePage : HomePage;
  let data: DataReader;

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    data = new DataReader('testdata.json');
    tradingPage = new TradingPage(page);
    homePage = new HomePage(page);
    await homePage.open();
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForLoadState('domcontentloaded');
  });

  test('TD01 - validate USDT pair display correctly in trading spot freature', async ({page}) => {
    await tradingPage.clickSpotTradingSection();
    await tradingPage.clickSpotCategory('USDT');

    const result = await tradingPage.verifyPairsEndWith('USDT');
  
    if (!result.valid) {
      console.log('Invalid pairs:', result.errors);
    }
     expect(result.valid, result.errors.join(', ')).toBeTruthy();
  });

  test('TD02 - validate BTC pair display correctly in trading spot freature', async ({page}) => {
    await tradingPage.clickSpotTradingSection();
    await tradingPage.clickSpotCategory('BTC');

    const result = await tradingPage.verifyPairsEndWith('BTC');
  
    if (!result.valid) {
      console.log('Invalid pairs:', result.errors);
    }
     expect(result.valid, result.errors.join(', ')).toBeTruthy();
  });
  test('TD03 - validate FIAT pair display correctly in trading spot freature', async ({page}) => {
    await tradingPage.clickSpotTradingSection();
    await tradingPage.clickSpotCategory('FIAT');

    const result = await tradingPage.verifyPairsEndWith('FIAT');
  
    if (!result.valid) {
      console.log('Invalid pairs:', result.errors);
    }
     expect(result.valid, result.errors.join(', ')).toBeTruthy();
  });
  test('TD04 - validate validate all category display correctly in trading spot freature', async ({page}) => {
    await tradingPage.clickSpotTradingSection();
    await tradingPage.clickSpotCategory('FIAT');

    const result = await tradingPage.verifyPairsEndWith('ALL');
  
    if (!result.valid) {
      console.log('Invalid pairs:', result.errors);
    }
     expect(result.valid, result.errors.join(', ')).toBeTruthy();
  });
});