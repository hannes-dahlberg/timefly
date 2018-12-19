import { DateTimeModel } from "../models";

export class AddTimerDTO {
  public constructor(
    public projectId: number,
    public start: string,
    public end: string,
    public comment: string,
  ) { }
}