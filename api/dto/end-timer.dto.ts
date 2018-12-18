import { DateTimeModel } from "../models";

export class EndTimerDTO {
  public constructor(
    public id: number,
    public end: DateTimeModel,
  ) { }
}