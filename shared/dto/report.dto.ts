import { DateTimeModel } from "../models";
import { DTO } from "./dto";
import { ITaskDTO, ITaskJSON, TaskDTO } from "./task.dto";
import { IUserDTO, IUserJSON, UserDTO } from "./user.dto";

export interface IReport<A, B, C, D> {
  id: number;
  user?: A;
  task?: B;
  start: C;
  end?: D;
  comment: string;
}
export interface IReportDTO extends IReport<IUserDTO, ITaskDTO, DateTimeModel, DateTimeModel> { }
export interface IReportJSON extends IReport<IUserJSON, ITaskJSON, string, string> { }

export class ReportDTO extends DTO<IReportDTO> implements IReportDTO {

  public static parse(object: IReportJSON): ReportDTO {
    return new ReportDTO({
      id: object.id,
      ...(object.user ? { user: UserDTO.parse(object.user) } : null),
      ...(object.task ? { task: TaskDTO.parse(object.task) } : null),
      start: new DateTimeModel(object.start),
      ...(object.end ? { end: new DateTimeModel(object.end) } : null),
      comment: object.comment,
    });
  }
  public id: number;
  public user?: UserDTO;
  public task?: TaskDTO;
  public start: DateTimeModel;
  public end: DateTimeModel;
  public comment: string;

  public serialize(): IReportJSON {
    return {
      id: this.id,
      ...(this.user ? { user: this.user.serialize() } : null),
      ...(this.task ? { task: this.task.serialize() } : null),
      start: this.start.toString(),
      ...(this.end !== undefined ? { end: this.end.toString() } : null),
      comment: this.comment,
    };
  }
}
