import { DTO } from "./dto";
import { IProjectDTO, IProjectJSON, ProjectDTO } from "./project.dto";
import { IReportDTO, IReportJSON, ReportDTO } from "./report.dto";

export interface ITask<A, B> {
  id: number;
  name: string;
  project?: A;
  reports?: B[];
}
export interface ITaskDTO extends ITask<IProjectDTO, IReportDTO> { }
export interface ITaskJSON extends ITask<IProjectJSON, IReportJSON> { }

export class TaskDTO extends DTO<ITaskDTO> implements ITaskDTO {

  public static parse(object: ITaskJSON): TaskDTO {
    return new TaskDTO({
      id: object.id,
      name: object.name,
      ...(object.project ? { project: ProjectDTO.parse(object.project) } : null),
      ...(object.reports ? { reports: object.reports.map((report: IReportJSON) => ReportDTO.parse(report)) } : null),
    });
  }
  public id: number;
  public name: string;
  public project?: ProjectDTO;
  public reports?: ReportDTO[];

  public serialize(): ITaskJSON {
    return {
      id: this.id,
      name: this.name,
      ...(this.project ? { project: this.project.serialize() } : null),
      ...(this.reports ? { reports: this.reports.map((report: ReportDTO) => report.serialize()) } : null),
    };
  }
}
