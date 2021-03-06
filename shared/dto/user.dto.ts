import { DTO } from "./dto";
import { IReportDTO, IReportJSON, ReportDTO } from "./report.dto";

export interface IUSer<A> {
  id: number;
  email: string;
  reports?: A[];
}
export interface IUserDTO extends IUSer<IReportDTO> { } // tslint:disable-line:no-empty-interface
export interface IUserJSON extends IUSer<IReportJSON> { } // tslint:disable-line:no-empty-interface

export class UserDTO extends DTO<IUserDTO> implements IUserDTO {

  public static parse(object: IUserJSON): UserDTO {
    return new UserDTO({
      id: object.id,
      email: object.email,
      ...(object.reports ? { reports: object.reports.map((report: IReportJSON) => ReportDTO.parse(report)) } : null),
    });
  }
  public id: number;
  public email: string;
  public reports?: ReportDTO[];

  public serialize(): IUserJSON {
    return {
      id: this.id,
      email: this.email,
      ...(this.reports ? { reports: this.reports.map((report: ReportDTO) => report.serialize()) } : null),
    };
  }
}
