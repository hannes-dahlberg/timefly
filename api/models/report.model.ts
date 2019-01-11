import { ModelModule } from "artoo";
import { UserModel } from "./user.model";
import { TaskModel } from "./task.model";
import { DateTimeModel } from "../../shared/models";

export class ReportModel extends ModelModule {
  public static table = 'reports';
  public static fields = ['id', 'user_id', 'task_id', 'start', 'end', 'comment'];
  public static fillable = ['start', 'user_id', 'task_id', 'end', 'comment'];

  public id: number;
  public user_id: number;
  public task_id: number;
  public get taskId(): number { return this.task_id; }
  public start: string;
  public end: string;
  public comment: string;

  public user() { return this.belongsTo(UserModel, 'user_id'); }
  public _user: UserModel | null = null;
  public task() { return this.belongsTo(TaskModel, 'task_id'); }
  public _task: TaskModel | null = null;
}