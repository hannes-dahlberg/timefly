import { DateTimeModel } from "../models";
import { DTO } from "./dto";

export interface ICreateReport<A, B> {
  taskId: number;
  start: A;
  end: B;
  comment: string | null;
}
export interface ICreateReportDTO extends ICreateReport<DateTimeModel, DateTimeModel> { }
export interface ICreateReportJSON extends ICreateReport<string, string> { }

export class CreateReportDTO extends DTO<ICreateReportDTO> implements ICreateReportDTO {

  public static parse(object: ICreateReportJSON): CreateReportDTO {
    return new CreateReportDTO({
      taskId: object.taskId,
      start: new DateTimeModel(object.start),
      end: new DateTimeModel(object.end),
      comment: object.comment,
    });
  }
  public taskId: number;
  public start: DateTimeModel;
  public end: DateTimeModel;
  public comment: string;

  public serialize(): ICreateReportJSON {
    return {
      taskId: this.taskId,
      start: this.start.toString(),
      end: this.end.toString(),
      comment: this.comment,
    };
  }
}
