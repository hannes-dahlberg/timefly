import { DateTimeModel } from "../models";

export class AddTimerDTO {
  public constructor(
    public project_id: number,
    public start: DateTimeModel,
    public end: DateTimeModel,
    public comment: string,
  ) { }
}