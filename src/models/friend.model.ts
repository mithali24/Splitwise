import type { Row } from '../core/storage/db.js';

export interface Friend extends Row {
  name: string;
  email: string;
  phone: string;
  balance: number;
}
