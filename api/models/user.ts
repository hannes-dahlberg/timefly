import { Models } from 'artoo';

import { Report } from './';

export class User extends Models.User {
  public reports() { return this.hasMany(Report, 'user_id'); }
}