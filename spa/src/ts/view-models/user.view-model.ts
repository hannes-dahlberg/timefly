import { ViewModel } from "./view-model";
import { ReportViewModel } from "./report.view-model";
import { TaskDTO, ReportDTO, UserDTO } from "../../../../shared/dto";

export interface IserViewModel {
  id: number,
  email: string,
  reports?: ReportViewModel[]
}

export class UserViewModel extends ViewModel<IserViewModel> implements IserViewModel {
  public id: number;
  public email: string;
  public reports?: ReportViewModel[];

  public static FromUserDTO(user: UserDTO): UserViewModel {
    return new UserViewModel({
      id: user.id,
      email: user.email,
      ...(user.reports ? { reports: user.reports.map((report: ReportDTO) => ReportViewModel.fromReportDTO(report)) } : null)
    });
  }
}