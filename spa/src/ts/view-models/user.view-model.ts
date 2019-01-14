import { ReportDTO, TaskDTO, UserDTO } from "../../../../shared/dto";
import { ReportViewModel } from "./report.view-model";
import { ViewModel } from "./view-model";

export interface IserViewModel {
  id: number;
  email: string;
  reports?: ReportViewModel[];
}

export class UserViewModel extends ViewModel<IserViewModel> implements IserViewModel {

  public static FromUserDTO(user: UserDTO): UserViewModel {
    return new UserViewModel({
      id: user.id,
      email: user.email,
      ...(user.reports ? { reports: user.reports.map((report: ReportDTO) => ReportViewModel.fromReportDTO(report)) } : null),
    });
  }
  public id: number;
  public email: string;
  public reports?: ReportViewModel[];
}
