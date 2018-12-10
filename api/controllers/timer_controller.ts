// Libs
import { Request, Response, RequestHandler } from "express";
import * as moment from "moment";
import { container, ConfigService, RelationModule } from "artoo";
import { UserModel, ReportModel } from "../models";

export class TimerController {
  public index(user: UserModel): RequestHandler {
    return (request: Request, response: Response): void => {
      (<RelationModule<ReportModel>>user.reports()).where('')
    };
  }
  public start(): RequestHandler {
    return (request: Request, response: Response): void => {

    };
  }

  public stop(): RequestHandler {
    return (request: Request, response: Response): void => {

    };
  }
}