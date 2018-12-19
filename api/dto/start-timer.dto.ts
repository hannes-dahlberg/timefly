import { DateTimeModel } from "../models/date-time.model";
import { DTO } from "./dto";
import { ConstructorParametersType } from 'artoo';
import { start } from "repl";

export class StartTimerDTO extends DTO {
  public constructor(
    public projectId: number,
    public start: string,
    public comment: string,
  ) { super(); }
}