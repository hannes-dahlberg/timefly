import { ReportDTO } from "../../../../shared/dto";
import { DateTimeModel } from "../../../../shared/models";
import { ViewModel } from "./view-model";
import { TaskViewModel } from "./task.view-model";
import { UserViewModel } from "./user.view-model";

export interface IReportViewModel {
  id: number;
  user?: UserViewModel;
  start: DateTimeModel;
  end: DateTimeModel | null;
  comment: string;
  task?: TaskViewModel;
}

export class ReportViewModel extends ViewModel<IReportViewModel> implements IReportViewModel {
  public id: number;
  public user?: UserViewModel;
  public start: DateTimeModel;
  public end: DateTimeModel | null;
  public comment: string;
  public task?: TaskViewModel;
  public get isActive(): boolean {
    return this.end === null;
  }

  public static fromReportDTO(report: ReportDTO): ReportViewModel {
    return new ReportViewModel({
      id: report.id,
      ...(report.user ? { user: UserViewModel.FromUserDTO(report.user) } : null),
      start: report.start,
      end: report.end,
      comment: report.comment,
      ...(report.task ? { task: TaskViewModel.fromTaskDTO(report.task) } : null)
    });
  }
}