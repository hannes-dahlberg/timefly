import { DateTimeModel } from "../models/date-time.model";
import { DTO } from "./dto";
import { ConstructorParametersType } from 'artoo';
import { start } from "repl";
import { TaskDTO } from "./task.dto";

export type StartTimerDTOProps = {
  taskId?: number,
  start: string | DateTimeModel,
  comment: string
}

export interface IStartTimer<A> {
  taskId: number,
  start: A;
  comment: string;
}
export interface IStartTimerDTO extends IStartTimer<DateTimeModel> { }
export interface IStartTimerJSON extends IStartTimer<string> { }

export class StartTimerDTO extends DTO<IStartTimerDTO> implements IStartTimerDTO {
  public taskId: number;
  public start: DateTimeModel;
  public comment: string;

  public serialize(): IStartTimerJSON {
    return {
      taskId: this.taskId,
      start: this.start.toString(),
      comment: this.comment
    }
  }

  public static parse(object: IStartTimerJSON): StartTimerDTO {
    return new StartTimerDTO({
      taskId: object.taskId,
      start: new DateTimeModel(object.start),
      comment: object.comment,
    });
  }

}