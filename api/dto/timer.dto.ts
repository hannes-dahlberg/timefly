import { DateTimeModel } from "../models";

export class TimerDTO {
  public constructor(
    public id: number,
    public projectId: number,
    public start: DateTimeModel,
    public end: DateTimeModel,
    public comment: string,
  ) { }
}