import { ModelModule } from "artoo";
import { ProjectModel } from "./project.model";
import { ReportModel } from "./report.model";

export class TaskModel extends ModelModule {
  public static table = 'tasks';
  public static fields = ['id', 'name', 'project_id'];
  public static fillable = ['name'];

  public id: number;
  public name: string;
  public project_id: number;
  public get projectId(): number { return this.project_id; }

  public project() { return this.belongsTo(ProjectModel, "project_id"); }
  public _project: ProjectModel | null = null;
  public reports() { return this.hasMany(ReportModel, "task_id"); }
  public _reports: ReportModel[] = [];
}