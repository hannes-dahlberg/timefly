import { ModelModule, GroupModel } from "artoo";
import { ProjectModel } from "./project.model";

export class ClientModel extends ModelModule {
  public static table = 'clients';
  public static fields = ['id', 'name'];
  public static fillable = ['name'];

  public name: string;

  public groups() { return this.belongsToMany(GroupModel, "clients_to_groups", "group_id", "client_id"); }
  public _groups: GroupModel[] = [];
  public projects() { return this.hasMany(ProjectModel, 'client_id'); }
  public _projects: ProjectModel[] = [];
}
