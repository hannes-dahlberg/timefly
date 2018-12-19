// Libs
import { ConfigService, container, ParametersType, RelationModule } from "artoo";
import { NextFunction, Request, RequestHandler, Response } from "express";
import * as moment from 'moment';
import { ReportModel } from "../models/report.model";
import { UserModel } from "../models/user.model";
import { DateTimeModel } from "../models/date-time.model";

import { middleware, Middlewares } from "../middlewares";
import { Validation } from "../modules/validation";
import { TimerDTO } from "../dto/timer.dto";
import { StartTimerDTO } from "../dto/start-timer.dto";
import { FormWorker, workForm } from "../modules/form-worker";
import { EndTimerDTO } from "../dto";

const middlewares: Middlewares = container.getService(Middlewares, { useName: 'service.middlewares' });
export class TimerController {
  public constructor(
    private readonly dateTimeModel: typeof DateTimeModel = container.get<typeof DateTimeModel>('model.dateTime', DateTimeModel)
  ) { }
  @middleware(middlewares.validation({ date: [Validation.required, Validation.date()] }))
  public index(): RequestHandler {
    return (request: Request, response: Response): void => {
      const start: Date = moment(`${request.query.date} 00:00:00`).toDate();
      const end: Date = moment(`${request.query.date} 23:59:59`).toDate();
      (<RelationModule<ReportModel>>request.user.reports())
        .where({ column: "start", operator: ">=", value: (new this.dateTimeModel(start)).toDateString() })
        .where({ column: "start", operator: "<=", value: (new this.dateTimeModel(end)).toDateString() })
        .get().then((reports: ReportModel[]) => {

          response.json(reports.map((report: ReportModel) => new TimerDTO(
            report.id,
            report.project_id,
            (new DateTimeModel(report.start)).toString(),
            (new DateTimeModel(report.end)).toString(),
            report.comment
          )));
        });
    };
  }

  @middleware(middlewares.validation({ projectId: Validation.required, start: [Validation.required, Validation.date()], comment: Validation.max(99999) }))
  @workForm({ projectId: FormWorker.parseInteger, start: FormWorker.parseModel<DateTimeModel, typeof DateTimeModel>(DateTimeModel) })
  public start(): RequestHandler {
    return (request: Request, response: Response): void => {
      // NNED TO VALIDATE THE CURRENT USER IS OWNER OF PROJECT
      let startTimer: StartTimerDTO = new StartTimerDTO(
        request.body.start,
        request.body.projectId,
        request.body.start
      );

      ReportModel.create<ReportModel>(startTimer).then((report: ReportModel) => response.send(
        new TimerDTO(
          report.id,
          report.projectId,
          (new DateTimeModel(report.start)).toString(),
          (new DateTimeModel(report.end)).toString(),
          report.comment
        )
      ));
    };
  }

  @middleware(middlewares.validation({ timerId: Validation.required, stop: [Validation.required, Validation.date()], comment: Validation.max(99999) }))
  public stop(): RequestHandler {
    return (request: Request, response: Response): void => {
      let endTimer: EndTimerDTO = new EndTimerDTO(
        request.body.number,
        request.body.end
      )
    };
  }
}
