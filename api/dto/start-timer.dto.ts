import { DateTimeModel } from "../models/date-time.model";

export class StartTimerDTO {
  public constructor(
    public project_id: number,
    public start: DateTimeModel,
    public comment: string,
  ) { }
}