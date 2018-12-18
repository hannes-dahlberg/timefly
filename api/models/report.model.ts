import { ModelModule } from "artoo";
import { UserModel } from "./user.model";
import { ProjectModel } from "./project.model";

export class ReportModel extends ModelModule {
  public static table = 'reports';
  public static fields = ['id', 'user_id', 'project_id', 'start', 'end', 'comment'];
  public static fillable = ['start', 'end', 'comment']

  public id: number;
  public user_id: number;
  public project_id: number;
  public start: Date;
  public end: Date;
  public comment: string;

  public User() { return this.belongsTo(UserModel, 'user_id'); }
  public Project() { return this.belongsTo(ProjectModel, 'project_id'); }
}