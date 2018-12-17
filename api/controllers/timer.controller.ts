// Libs
import { ConfigService, container, ParametersType, RelationModule } from "artoo";
import { NextFunction, Request, RequestHandler, Response } from "express";
import * as moment from 'moment';
import { ReportModel } from "../models/report.model";
import { UserModel } from "../models/user.model";
import { DateTimeModel } from "../models/date-time.model";

import { middleware, Middlewares } from "../middlewares";
import { formWorker, workForm } from "../modules/formWorker";
import { Validation } from "../modules/validation";

const middlewares: Middlewares = container.getService(Middlewares, { useName: 'service.middlewares'});

export class TimerController {
  public constructor(
    private readonly dateTimeModel: typeof DateTimeModel = container.get<typeof DateTimeModel>('model.dateTime', DateTimeModel)
  ) { }
  @middleware(middlewares.validation({ date: [Validation.required, Validation.date()] }))
  @workForm({ start: formWorker.decimal(2, '.') })
  public index(): RequestHandler {
    return (request: Request, response: Response): void => {
      console.log(request.query);
      const start: Date = moment(`${request.query.date} 00:00:00`).toDate();
      const end: Date = moment(`${request.query.date} 23:59:59`).toDate();
      (<RelationModule<ReportModel>>request.user.reports())
      .where({ column: "start", operator: ">=", value: (new this.dateTimeModel(start)).toDateString() })
      .where({ column: "start", operator: "<=", value: (new this.dateTimeModel(end)).toDateString() })
      .get().then((reports: ReportModel[]) => {
        response.json(reports);
      });
    };
  }

  @middleware(middlewares.validation({ projectId: Validation.required, start: [Validation.required, Validation.date()] }))
  public start(): RequestHandler {
    return (request: Request, response: Response): void => {
      
    };
  }

  public stop(): RequestHandler {
    return (request: Request, response: Response): void => {

    };
  }
}
