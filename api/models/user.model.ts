import { ModelModule, UserModel as ArtooUserModel, RelationModule, IRelationType } from "artoo";

import { TaskModel } from "./task.model";
import { ReportModel } from "./report.model";
import { GroupModel } from "./group.model";

export class UserModel extends ArtooUserModel {
  public static table = "users";
  public static fields = ["id", "email", "password"];
  public static fillable = ["email", "password"];

  public email: string;

  public static find<T extends ModelModule>(id: number): Promise<T> {
    return this.where<T>("id", id.toString()).first();
  }
  public reports() { return this.hasMany(ReportModel, "user_id"); }
  public _reports: ReportModel[] = [];

  public groups() { return this.belongsToMany<GroupModel>(GroupModel, "users_to_groups", "user_id", "group_id"); }
  public _groups: GroupModel[] = [];
}
