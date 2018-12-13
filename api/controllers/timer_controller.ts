// Libs
import { Request, Response, RequestHandler } from "express";
import * as moment from "moment";
import { container, ConfigService, RelationModule } from "artoo";
import { UserModel } from "../models/user_model";
import { ReportModel } from "../models/report_model";

export class TimerController {
  public index(): RequestHandler {
    return (request: Request, response: Response): void => {
      response.sendStatus(200);
      //(<RelationModule<ReportModel>>request.user.reports()).where('start', '>')
    };
  }
  public start(): RequestHandler {
    return (request: Request, response: Response): void => {
      response.app.use()
    };
  }

  public stop(): RequestHandler {
    return (request: Request, response: Response): void => {

    };
  }
}