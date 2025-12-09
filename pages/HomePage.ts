import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { DataReader } from '../utility';

export class HomePage extends BasePage {
  private data: DataReader;

  constructor(page: Page) {
    super(page, 'homepage.properties');
    this.data = new DataReader('testdata.json');
  }

  async open() {
    await this.navigate(this.data.getString('config.baseUrl'));
  }

  async verifyTitle(): Promise<boolean> {
    const title = await this.page.title();
    return title.includes(this.data.getString('expected.pageTitle'));
  }

  async clickTradeMenu() {
    await this.click('nav.trade');
    
  }

   async clickFeaturesMenu() {
    await this.click('nav.features');
  }

   async clickAboutUs() {
    await this.click('nav.aboutus');
  }

  async clickAppStore() {
    await this.click('app.appstore');
  }

   async clickPlayStore() {
    await this.click('app.playstore');
  }
 
  async getSubmenuTradeLocator(name: string) {
    const raw = this.locators.get('nav.tradesubmenu'); 
    const selector = raw.replace('{name}', name);
    return this.page.locator(selector);
  }

    async getSubmenuFeatureLocator(name: string) {
    const raw = this.locators.get('nav.featuresubmenu'); 
    const selector = raw.replace('{name}', name);
    return this.page.locator(selector);
  }

    async getSubmenuAboutusLocator(name: string) {
    const raw = this.locators.get('nav.aboutusubmenu'); 
    const selector = raw.replace('{name}', name);
    return this.page.locator(selector);
  }

  async getVisibleMenuItems(): Promise<string[]> {
    const visible: string[] = [];
    const items = this.data.getArray<{ name: string; locatorKey: string }>('navigation.menuItems');
    
    for (const item of items) {
      if (await this.isVisible(item.locatorKey)) {
        visible.push(item.name);
      }
    }
    return visible;
  }

  async verifyAllMenuItemsVisible(): Promise<boolean> {
    const items = this.data.getArray<{ name: string; locatorKey: string }>('navigation.menuItems');
    for (const item of items) {
      if (!(await this.isVisible(item.locatorKey))) {
        console.log(`Not visible: ${item.name}`);
        return false;
      }
    }
    return true;
  }


  async verifyTradeSubmenuVisible(): Promise<boolean> {
  // List of submenu names
  const submenuNames = ['Spot', 'Derivatives', 'Instant Buy', 'Panic Sell', 'Convert'];
  for (const name of submenuNames) {
    const locator = await this.getSubmenuTradeLocator(name);
    // Use isVisible() to check if the submenu item is visible
    const visible = await this.isElementVisible(locator);
    if (!visible) return false;
  }

  return true; // all submenu items are visible
}


  async verifySubFeatureMenuVisible(): Promise<boolean> {
    const submenuNames = ['Spot Exchange', 'Institutional', 'Buy & Sell' ];
    for (const name of submenuNames) {
    const locator = await this.getSubmenuFeatureLocator(name);
    const visible = await this.isElementVisible(locator);
    if (!visible) return false;
    }

    return true; // all submenu items are visible
  }

  async verifySubmenuAboutUs(): Promise<boolean> {
  // List of submenu names
  const submenuNames = ['Why Multibank?', 'Global Presence', 'Management', 'Awards', 'Sponsorship', 'Blog', 'Milestones'];
  for (const name of submenuNames) {
    const locator = await this.getSubmenuAboutusLocator(name);
    // Use isVisible() to check if the submenu item is visible
    const visible = await this.isElementVisible(locator);
    if (!visible) return false;
  }

  return true; // all submenu items are visible
}


  async clickNavItem(name: string) {
    const items = this.data.getArray<{ name: string; locatorKey: string }>('navigation.menuItems');
    const item = items.find(i => i.name === name);
    if (!item) throw new Error(`Menu item not found: ${name}`);
    await this.click(item.locatorKey);
  }

  async scrollToPlayStore(): Promise<boolean> {
    await this.scrollTo('app.playstore');
    return await this.isVisible('app.playstore');
 }

  async scrollToAppStore(): Promise<boolean> {
    await this.scrollTo('app.appstore');
    return await this.isVisible('app.playstore');
 }


  async verifyNewTabUrl(expectedUrlKey: string) {
    const newTab = await this.switchToNewTab();
    const expectedUrl = this.data.getString(expectedUrlKey);

    console.log(`expected url is ${expectedUrl}`);

    const currentUrl = newTab.url();
     expect(currentUrl).toContain(expectedUrl);
  }
  // Expose data reader for tests
  getData(): DataReader { return this.data; }
}
