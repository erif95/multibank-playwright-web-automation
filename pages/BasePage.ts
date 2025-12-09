import { Page, Locator, expect } from '@playwright/test';
import { LocatorReader } from '../utility';

export class BasePage {
  protected page: Page;
  protected locators: LocatorReader;

  constructor(page: Page, locatorFile: string) {
    this.page = page;
    this.locators = new LocatorReader(locatorFile);
  }

  // Get locator by key from properties file
  $(key: string): Locator {
    return this.locators.getLocator(this.page, key).first();
  }

  async navigate(url: string) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async isVisible(key: string, timeout = 10000): Promise<boolean> {
    try {
      await this.$(key).waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async isElementVisible (target: string | Locator, timeout = 10000): Promise<boolean> {
  let locator: Locator;

  if (typeof target === 'string') {
    locator = this.$(target); // key from properties
  } else {
    locator = target;         // already a Locator
  }

  try {
    await locator.waitFor({ state: 'visible', timeout });
    return true;
  } catch {
    return false;
  }
}

  async click(key: string) {
    await this.$(key).click();
  }

  async hover(key: string) {
    await this.$(key).hover();
  }

  async getText(key: string): Promise<string> {
    return this.$(key).innerText();
  }

  async scrollTo(key: string) {
    await this.$(key).scrollIntoViewIfNeeded();
  }

  async switchToNewTab(): Promise<Page> {
    const newPage = await this.page.context().waitForEvent('page');
    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }

  getUrl(page: Page): string {
  return page.url();
  }

}
