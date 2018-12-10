import { UserModel as ArtooUserModel } from 'artoo';

import { ReportModel } from './';

export class UserModel extends ArtooUserModel {
  public reports() { return this.hasMany(ReportModel, 'user_id'); }
}