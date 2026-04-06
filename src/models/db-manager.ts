import path from 'path';
import {
  Database,
  type Dataset,
  type Row,
  JsonStorageAdapter,
} from '../core/storage/db.js';
import type { Friend } from './friend.model.js';

interface AppData extends Dataset {
  friends: Friend[];
}

export class AppDBManager {
    private constructor() {
      const dbPath=path.resolve(process.cwd(), 'data/data.json');
    this.db = new Database<AppData>(dbPath,new JsonStorageAdapter<AppData>());
  }
  private static sharedInstance: AppDBManager | undefined = undefined;
  private db: Database<AppData>;

  static getInstance(): AppDBManager {
    if (!this.sharedInstance) {
      this.sharedInstance = new AppDBManager();
    }
    return this.sharedInstance;
  }

  getDB() {
    return this.db;
  }

  save() {
    this.db.save();
  }
}
