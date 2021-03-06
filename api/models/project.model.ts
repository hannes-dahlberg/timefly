import { ModelModule } from "artos";
import { ClientModel } from "./client.model";
import { GroupModel } from "./group.model";
import { TaskModel } from "./task.model";

export class ProjectModel extends ModelModule {
  public get clientId(): number { return this.client_id; }
  public static table = "projects";
  public static fields = ["id", "name", "comment", "client_id"];
  public static fillable = ["name", "comment"];

  public id: number;
  public name: string;
  public comment: string;
  public client_id: number; // tslint:disable-line:variable-name
  public _client: ClientModel | null = null;
  public _tasks: TaskModel[] = [];

  public client() { return this.belongsTo(ClientModel, "client_id"); }
  public tasks() { return this.hasMany(TaskModel, "project_id"); }
}
