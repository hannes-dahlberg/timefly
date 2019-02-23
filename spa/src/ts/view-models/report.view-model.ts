import { ReportDTO } from "../../../../shared/dto";
import { DateTimeModel } from "../../../../shared/models";
import { TaskViewModel } from "./task.view-model";
import { UserViewModel } from "./user.view-model";
import { ViewModel } from "./view-model";

export interface IReportViewModel {
  id: number;
  user?: UserViewModel;
  start: DateTimeModel;
  end?: DateTimeModel;
  comment: string;
  task?: TaskViewModel;
}

export class ReportViewModel extends ViewModel<IReportViewModel> implements IReportViewModel {
  public get isActive(): boolean {
    return this.end === undefined;
  }

  public get diffSeconds(): number {
    return (this.end || new DateTimeModel()).toMoment().diff(this.start.toMoment(), "seconds") % 60;
  }

  public get diffMinutes(): number {
    return (this.end || new DateTimeModel()).toMoment().diff(this.start.toMoment(), "minutes") % 60;
  }

  public get diffHours(): number {
    return (this.end || new DateTimeModel()).toMoment().diff(this.start.toMoment(), "hours") % 60;
  }

  public static fromReportDTO(report: ReportDTO): ReportViewModel {
    return new ReportViewModel({
      id: report.id,
      ...(report.user ? { user: UserViewModel.FromUserDTO(report.user) } : null),
      start: report.start,
      end: report.end,
      comment: report.comment,
      ...(report.task ? { task: TaskViewModel.fromTaskDTO(report.task) } : null),
    });
  }
  public id: number;
  public user?: UserViewModel;
  public start: DateTimeModel;
  public end?: DateTimeModel;
  public comment: string;
  public task?: TaskViewModel;

  public clone(): ReportViewModel {
    return new ReportViewModel({
      id: this.id,
      ...(this.user ? { user: this.user.clone() } : null),
      start: this.start,
      end: this.end,
      comment: this.comment,
      ...(this.task ? { task: this.task.clone() } : null),
    });
  }
}
