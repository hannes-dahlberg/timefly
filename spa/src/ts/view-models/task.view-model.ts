import { TaskDTO, ReportDTO, ProjectDTO } from "../../../../shared/dto";
import { ReportViewModel } from "./report.view-model";
import { ViewModel } from "./view-model";
import { ProjectViewModel } from "./project.view-model";

export interface ITaskViewModel {
  id: number;
  name: string;
  project?: ProjectViewModel;
  reports?: ReportViewModel[];
}

export class TaskViewModel extends ViewModel<ITaskViewModel> implements ITaskViewModel {
  public id: number;
  public name: string;
  public project?: ProjectViewModel;
  public reports?: ReportViewModel[];

  public static fromTaskDTO(task: TaskDTO): TaskViewModel {
    return new TaskViewModel({
      id: task.id,
      name: task.name,
      ...(task.project ? { project: ProjectViewModel.fromProjectDTO(task.project) } : null),
      ...(task.reports ? { reports: task.reports.map((project: ReportDTO) => ReportViewModel.fromReportDTO(project)) } : null)
    });
  }
}