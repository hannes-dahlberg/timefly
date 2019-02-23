import { ProjectDTO, ReportDTO, TaskDTO } from "../../../../shared/dto";
import { ProjectViewModel } from "./project.view-model";
import { ReportViewModel } from "./report.view-model";
import { ViewModel } from "./view-model";

export interface ITaskViewModel {
  id: number;
  name: string;
  project?: ProjectViewModel;
  reports?: ReportViewModel[];
}

export class TaskViewModel extends ViewModel<ITaskViewModel> implements ITaskViewModel {

  public static fromTaskDTO(task: TaskDTO): TaskViewModel {
    return new TaskViewModel({
      id: task.id,
      name: task.name,
      ...(task.project ? { project: ProjectViewModel.fromProjectDTO(task.project) } : null),
      ...(task.reports ? { reports: task.reports.map((report: ReportDTO) => ReportViewModel.fromReportDTO(report)) } : null),
    });
  }
  public id: number;
  public name: string;
  public project?: ProjectViewModel;
  public reports?: ReportViewModel[];

  public clone(): TaskViewModel {
    return new TaskViewModel({
      id: this.id,
      name: this.name,
      ...(this.project ? { project: this.project.clone() } : null),
      ...(this.reports ? { reports: this.reports.map((report: ReportViewModel) => report.clone()) } : null),
    });
  }
}
