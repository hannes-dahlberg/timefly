import { DateTimeModel } from "../models/date-time.model";
import { DTO } from "./dto";

export interface IEndTimer<A> {
  id: number;
  end: A;
}

export interface IEndTimerDTO extends IEndTimer<DateTimeModel> { }
export interface IEndTimerJSON extends IEndTimer<string> { }

export class EndTimerDTO extends DTO<IEndTimerDTO> implements IEndTimerDTO {
  public id: number;
  public end: DateTimeModel;

  public serialize(): IEndTimerJSON {
    return {
      id: this.id,
      end: this.end.toString(),
    }
  }

  public static parse(object: IEndTimerJSON): EndTimerDTO {
    return new EndTimerDTO({
      id: object.id,
      end: new DateTimeModel(object.end),
    });
  }

}