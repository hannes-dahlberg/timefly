// Libs
import { ConfigService, container, ParametersType, RelationModule, HelperService, PromService } from "artoo";
import { NextFunction, Request, RequestHandler, Response } from "express";
import * as moment from 'moment';
import { ReportModel } from "../models/report.model";
import { UserModel } from "../models/user.model";

import { DateTimeModel } from "../../shared/models/date-time.model";

import { middleware, Middlewares } from "../middlewares";
import { Validation } from "../modules/validation";
import { FormWorker, workForm } from "../modules/form-worker";
import { EndTimerDTO, StartTimerDTO, ReportDTO } from "../../shared/dto";
import { TaskModel } from "../models/task.model";
import { rejects } from "assert";

const middlewares: Middlewares = container.getService(Middlewares, { useName: 'service.middlewares' });
const promService: PromService = container.getService(PromService, { useName: 'service.prom' });
const helperService: HelperService = container.getService(HelperService, { useName: 'service.helper' });
export class TimerController {
  public constructor(
    private readonly dateTimeModel: typeof DateTimeModel = container.get<typeof DateTimeModel>('model.dateTime', DateTimeModel)
  ) { }

  @middleware(middlewares.validation({ taskId: [Validation.required, Validation.number], start: [Validation.required, Validation.date()], comment: Validation.max(99999) }))
  public start(): RequestHandler {
    return (request: Request, response: Response): void => {
      //Map payload to object
      let startTimer: StartTimerDTO = new StartTimerDTO({
        taskId: request.body.taskId,
        start: request.body.start,
        comment: request.body.comment
      });

      //Check if user is owner of task
      UserModel
        .with('groups.clients.projects.tasks')
        .where('tasks.id', startTimer.taskId.toString())
        .first().then((user: UserModel) => {
          if (user !== undefined) {
            //Create new report
            ReportModel.create<ReportModel>({
              start: startTimer.start.toString(),
              user_id: request.user.id.toString(),
              task_id: startTimer.taskId,
              comment: startTimer.comment
            }).then((report: ReportModel) => {
              //Check if another timer is already present. If so stops it
              ReportModel
                .where('user_id', request.user.id.toString())
                .where({ column: 'id', operator: '!=', value: report.id.toString() })
                .where({ column: 'start', operator: '>=', value: startTimer.start.toMoment().format("YYYY-MM-DD 00:00:00") })
                .where({ column: 'start', operator: '<', value: startTimer.start.toMoment().add(1, 'day').format("YYYY-MM-DD 00:00:00") })
                .whereIsNull('end').first().then((report: ReportModel) => {
                  const send = () => {
                    response.sendStatus(200);
                  };

                  if (report === undefined) {
                    send();
                  } else {
                    //Stop the timer
                    report.end = startTimer.start.toString();
                    report.save().then(() => send()).catch((error: any) => response.sendStatus(500));
                  }
                }).catch((error: any) => response.status(500).send(error));
            }).catch((error: any) => response.sendStatus(500));
          } else {
            response.sendStatus(400);
          }
        }).catch((error: any) => response.status(500).send(error));
    };
  }

  @middleware(middlewares.validation({ timerId: Validation.required, stop: [Validation.required, Validation.date()], comment: Validation.max(99999) }))
  public stop(): RequestHandler {
    return (request: Request, response: Response): void => {
      let endTimer: EndTimerDTO = new EndTimerDTO({
        id: request.body.id,
        end: request.body.end
      });

      //Validate ownership of timer
      ReportModel.with('user').where('id', endTimer.id.toString()).where('user.id', request.user.id.toString()).first().then((report: ReportModel) => {
        report.end = endTimer.end.toDateString();
        report.save().then(() => {
          response.sendStatus(200);
        });
      });
    };
  }
}
