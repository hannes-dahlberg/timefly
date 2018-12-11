import { UserModel as ArtooUserModel } from 'artoo';

import { ReportModel } from './report_model';

export class UserModel extends ArtooUserModel {
  public reports() { return this.hasMany(ReportModel, 'user_id'); }
}