import { ModelModule } from 'artoo';
import { GroupModel } from './group.model';
import { TaskModel } from './task.model';
import { ClientModel } from './client.model';

export class ProjectModel extends ModelModule {
  public static table = 'projects';
  public static fields = ['id', 'name', 'comment', 'client_id'];
  public static fillable = ['name', 'comment'];

  public id: number;
  public name: string;
  public comment: string;
  public client_id: number;
  public get clientId(): number { return this.client_id; }

  public client() { return this.belongsTo(ClientModel, "client_id"); }
  public _client: ClientModel | null = null;
  public tasks() { return this.hasMany(TaskModel, "project_id"); }
  public _tasks: TaskModel[] = [];
}