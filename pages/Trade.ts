import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HomePage } from './HomePage';
import { DataReader } from '../utility';

export class TradingPage extends BasePage {
  private data: DataReader;
  private homePage: HomePage; 

  constructor(page: Page) {
    super(page, 'homepage.properties', 'trade.properties');
    this.data = new DataReader('testdata.json');
    this.homePage = new HomePage (page);
  }

  // Click Spot tab
  async clickSpotTradingSection() {
     await this.click('nav.trade');
     const spotMenu = await this.homePage.getSubmenuTradeLocator("Spot");
     spotMenu.click();
  }

  // Click spot category (USDT, BTC, FIAT, All, Favorites)
  async clickSpotCategory(category: string) {
    await this.waitUntilReady('trade_pair');
    await this.click('trade_pair');
    const categories = this.data.getArray<{ name: string; locatorKey: string }>('tradingSpot.categories');
    const cat = categories.find(c => c.name === category);
    if (!cat) throw new Error(`Category not found: ${category}`);
    await this.click(cat.locatorKey);
  }

  getPairSuffix(category: string): string[] {
    const categories = this.data.getArray<{ name: string; pairSuffix: string[] }>('tradingSpot.categories');
    const cat = categories.find(c => c.name === category);
    return cat?.pairSuffix || [];
   }

  // Get all pairs from table
  async getAllPairs(): Promise<string[]> {
    await this.waitUntilReady('spot.pairlist');
    const pairElements = this.$$('spot.pairlist')
    const count = await pairElements.count();
    const pairs: string[] = [];

    console.log(`Found ${count} pairs`);

    for (let i = 0; i < count; i++) {
      const pair = await pairElements.nth(i).innerText();
      if (pair && pair.trim() !== '') {
        pairs.push(pair.trim());
      }
    }
    return pairs;
  }

  // Verify all pairs end with expected suffix
  async verifyPairsEndWith(category: string): Promise<{ valid: boolean; errors: string[] }> {
    const expectedSuffixes = this.getPairSuffix(category);
    const pairs = await this.getAllPairs();
    const errors: string[] = [];

    console.log(`Category: ${category}, Expected suffixes: ${expectedSuffixes.join(', ')}`);
    console.log(`Found ${pairs.length} pairs`);

    for (const pair of pairs) {
        const matched = expectedSuffixes.some(suffix => pair.endsWith(suffix));
    if (!matched) {
      errors.push(`"${pair}" does not end with any of ${expectedSuffixes.join(', ')}`);
     }
    }

    return { valid: errors.length === 0, errors };
}

}