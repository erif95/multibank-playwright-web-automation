import * as fs from 'fs';
import * as path from 'path';
import { Page, Locator } from '@playwright/test';

/**
 * Reads locators from .properties file
 * Supports: css, xpath, id, role, text, testid
 */
export class LocatorReader {
  private locators: Map<string, string> = new Map();

  constructor(...fileNames: string[]) {
        
    for (const fileName of fileNames) {
      this.loadFile(fileName);
      }
    }

  private loadFile(fileName: string) {
    const filePath = path.join(__dirname, '..', 'locators', fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Locator file not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const idx = trimmed.indexOf('=');
        if (idx > 0) {
          this.locators.set(trimmed.substring(0, idx).trim(), trimmed.substring(idx + 1).trim());
        }
      }
    });
  }

  get(key: string): string {
    const locator = this.locators.get(key);
    if (!locator) throw new Error(`Locator not found: ${key}`);
    return locator;
  }

  /**
   * Creates Playwright locator based on strategy prefix
   * Examples: css=button, xpath=//div, id=submit, role=link[name="Home"], text=Click, testid=btn
   */
  getLocator(page: Page, key: string): Locator {
    const raw = this.get(key);
    
    // Parse strategy prefix
    const match = raw.match(/^(css|xpath|id|role|text|testid)=(.+)$/i);
    
    if (match) {
      const [, strategy, value] = match;
      switch (strategy.toLowerCase()) {
        case 'css': return page.locator(value);
        case 'xpath': return page.locator(value);
        case 'id': return page.locator(`#${value}`);
        case 'text': return page.getByText(value);
        case 'testid': return page.getByTestId(value);
        case 'role':
          // Parse: role=link[name="Dashboard" exact=true]
          const roleMatch = value.match(/^(\w+)(?:\[(.+)\])?$/);
          if (roleMatch) {
            const [, role, opts] = roleMatch;
            const options: any = {};
            if (opts) {
              opts.match(/(\w+)=(?:"([^"]+)"|(\w+))/g)?.forEach(o => {
                const [k, v] = o.split('=');
                options[k] = v.replace(/"/g, '') === 'true' ? true : v.replace(/"/g, '');
              });
            }
            return page.getByRole(role as any, options);
          }
      }
    }
    
    // Auto-detect XPath or CSS
    if (raw.startsWith('//')) return page.locator(raw);
    return page.locator(raw);
  }
}
