import * as fs from 'fs';
import * as path from 'path';

/**
 * Reads test data from JSON file
 * Supports dot notation: get('navigation.menuItems')
 */
export class DataReader {
  private data: any;

  constructor(fileName: string) {
    const filePath = path.resolve(__dirname, '../testdata', fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Data file not found: ${filePath}`);
    }
    this.data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  get<T = any>(key: string): T {
   const result = key.split('.').reduce((obj, k) => obj?.[k], this.data);
    if (result === undefined) {
    throw new Error(` DataReader: Key not found → "${key}"`);
    }
    return result;
  }

  getString(key: string): string { return this.get<string>(key); }
  getNumber(key: string): number { return this.get<number>(key); }
  getArray<T = any>(key: string): T[] { return this.get<T[]>(key); }
  getByPath(path: string): any { return path.split('.').reduce((obj, key) => obj?.[key], this.data);}
}
