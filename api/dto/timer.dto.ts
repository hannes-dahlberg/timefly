import { DateTimeModel } from "../models";

export class TimerDTO {
  public constructor(
    public id: number,
    public projectId: number,
    public start: string,
    public end: string,
    public comment: string,
  ) { }
}