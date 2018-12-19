import { ModelModule, UserModel as ArtooUserModel } from "artoo";

import { ReportModel } from "./report.model";

export class UserModel extends ArtooUserModel {

  public static find<T extends ModelModule>(id: number): Promise<T> {
    return this.where<T>("id", id.toString()).first();
  }
  public reports() { return this.hasMany(ReportModel, "user_id"); }
  public projects() { return this.hasMany() }
}
