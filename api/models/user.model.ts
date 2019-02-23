import { UserModel as ArtosUserModel } from "artos";
import { GroupModel } from "./group.model";
import { ReportModel } from "./report.model";

export class UserModel extends ArtosUserModel {
  public static table = "users";
  public static fields = ["id", "email", "password"];
  public static fillable = ["email", "password"];

  public email: string;
  public _reports: ReportModel[] = [];

  public _groups: GroupModel[] = [];
  public reports() { return this.hasMany(ReportModel, "user_id"); }

  public groups() { return this.belongsToMany<GroupModel>(GroupModel, "users_to_groups", "user_id", "group_id"); }
}
