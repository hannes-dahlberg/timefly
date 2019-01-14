import { ModelModule } from "artos";
import { DateTimeModel } from "../../shared/models";
import { TaskModel } from "./task.model";
import { UserModel } from "./user.model";

export class ReportModel extends ModelModule {
  public get taskId(): number { return this.task_id; }
  public static table = "reports";
  public static fields = ["id", "user_id", "task_id", "start", "end", "comment"];
  public static fillable = ["start", "user_id", "task_id", "end", "comment"];

  public id: number;
  public user_id: number; // tslint:disable-line:variable-name
  public task_id: number; // tslint:disable-line:variable-name
  public start: string;
  public end: string;
  public comment: string;
  public _user: UserModel | null = null;
  public _task: TaskModel | null = null;

  public user() { return this.belongsTo(UserModel, "user_id"); }
  public task() { return this.belongsTo(TaskModel, "task_id"); }
}
