import { GroupModel, ModelModule } from "artos";
import { ProjectModel } from "./project.model";

export class ClientModel extends ModelModule {
  public static table = "clients";
  public static fields = ["id", "name"];
  public static fillable = ["name"];

  public name: string;
  public _groups: GroupModel[] = [];
  public _projects: ProjectModel[] = [];

  public groups() { return this.belongsToMany(GroupModel, "clients_to_groups", "group_id", "client_id"); }
  public projects() { return this.hasMany(ProjectModel, "client_id"); }
}
