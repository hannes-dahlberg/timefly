import { DateTimeModel } from "../models";
import { DTO } from "./dto";

export interface IEditReport<A, B> {
  id: number;
  taskId: number;
  start: A;
  end?: B;
  comment: string;
}

export interface IEditReportDTO extends IEditReport<DateTimeModel, DateTimeModel> { }
export interface IEditReportJSON extends IEditReport<string, string> { }

export class EditReportDTO extends DTO<IEditReportDTO> implements IEditReportDTO {

  public static parse(object: IEditReportJSON): EditReportDTO {
    return new EditReportDTO({
      id: object.id,
      taskId: object.taskId,
      start: new DateTimeModel(object.start),
      ...(object.end ? { end: new DateTimeModel(object.end) } : null),
      comment: object.comment,
    });
  }
  public id: number;
  public taskId: number;
  public start: DateTimeModel;
  public end?: DateTimeModel;
  public comment: string;

  public serialize(): IEditReportJSON {
    return {
      id: this.id,
      taskId: this.taskId,
      start: this.start.toString(),
      ...(this.end ? { end: this.end.toString() } : null),
      comment: this.comment,
    };
  }
}
