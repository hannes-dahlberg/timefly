// Libs
import { ConfigService, container, ParametersType, RelationModule } from "artoo";
import { NextFunction, Request, RequestHandler, Response } from "express";
import * as moment from "moment";
import { ReportModel } from "../models/report_model";
import { UserModel } from "../models/user_model";

import { middleware, Middlewares } from "../middlewares";
import { Validation } from "../modules/validation";

const middlewares: Middlewares = container.getService(Middlewares);

export class TimerController {

  @middleware(middlewares.validation({ date: [Validation.required, Validation.date()] }))
  public index(): RequestHandler {
    return (request: Request, response: Response): void => {
      response.sendStatus(200);
      // (<RelationModule<ReportModel>>request.user.reports()).where('start', '>')
    };
  }
  public start(): RequestHandler {
    return (request: Request, response: Response): void => {
      response.app.use();
    };
  }

  public stop(): RequestHandler {
    return (request: Request, response: Response): void => {

    };
  }
}
