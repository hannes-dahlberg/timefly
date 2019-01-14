import { ModelModule } from "artos";
import { ProjectModel } from "./project.model";
import { ReportModel } from "./report.model";

export class TaskModel extends ModelModule {
  public get projectId(): number { return this.project_id; }
  public static table = "tasks";
  public static fields = ["id", "name", "project_id"];
  public static fillable = ["name"];

  public id: number;
  public name: string;
  public project_id: number; // tslint:disable-line:variable-name
  public _project: ProjectModel | null = null;
  public _reports: ReportModel[] = [];

  public project() { return this.belongsTo(ProjectModel, "project_id"); }
  public reports() { return this.hasMany(ReportModel, "task_id"); }
}
