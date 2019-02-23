// Libs
import { container, HelperService, PromService } from "artos";
import { Request, RequestHandler, Response } from "express";
import { ReportModel } from "../models/report.model";
import { UserModel } from "../models/user.model";

import { DateTimeModel } from "../../shared/models/date-time.model";

import { EndTimerDTO, StartTimerDTO } from "../../shared/dto";
import { middleware, Middlewares } from "../middlewares";
import { Validation } from "../modules/validation";

const middlewares: Middlewares = container.getService(Middlewares, { useName: "service.middlewares" });
export class TimerController {
  public constructor(
    private readonly dateTimeModel: typeof DateTimeModel = container.get<typeof DateTimeModel>("model.dateTime", DateTimeModel),
  ) { }

  @middleware(middlewares.validation({ taskId: [Validation.required, Validation.number], start: [Validation.required, Validation.date()], comment: Validation.max(99999) }))
  public start(): RequestHandler {
    return (request: Request, response: Response): void => {
      // Map payload to object
      console.log(request.body);
      const startTimer: StartTimerDTO = StartTimerDTO.parse({
        taskId: request.body.taskId,
        start: request.body.start,
        comment: request.body.comment,
      });

      console.log(startTimer);

      // Check if user is owner of task
      UserModel
        .with("groups.clients.projects.tasks")
        .where("users.id", request.user.id.toString())
        .where("tasks.id", startTimer.taskId.toString())
        .first().then((user: UserModel) => {
          if (user === undefined) { response.sendStatus(400); return; }
          // Create new report
          ReportModel.create<ReportModel>({
            start: startTimer.start.toString(),
            user_id: request.user.id.toString(),
            task_id: startTimer.taskId,
            comment: startTimer.comment,
          }).then((report: ReportModel) => {
            // Check if another timer is already present. If so stops it
            ReportModel
              .where("user_id", request.user.id.toString())
              .where({ column: "id", operator: "!=", value: report.id.toString() })
              .where({ column: "start", operator: ">=", value: startTimer.start.toMoment().format("YYYY-MM-DD 00:00:00") })
              .where({ column: "start", operator: "<", value: startTimer.start.toMoment().add(1, "day").format("YYYY-MM-DD 00:00:00") })
              .whereIsNull("end").first().then((report: ReportModel) => {
                const send = () => {
                  response.sendStatus(200);
                };

                if (report === undefined) {
                  send();
                } else {
                  // Stop the timer
                  report.end = startTimer.start.toString();
                  report.save().then(() => send()).catch(() => response.sendStatus(500));
                }
              }).catch(() => response.status(500));
          }).catch(() => response.sendStatus(500));
        }).catch(() => response.status(500));
    };
  }

  @middleware(middlewares.validation({ timerId: Validation.required, stop: [Validation.required, Validation.date()], comment: Validation.max(99999) }))
  public stop(): RequestHandler {
    return (request: Request, response: Response): void => {
      const endTimer: EndTimerDTO = EndTimerDTO.parse({
        id: request.params.id,
        end: request.body.end,
      });

      // Validate ownership of timer
      ReportModel.with("user").where("id", endTimer.id.toString()).where("users.id", request.user.id.toString()).first().then((report: ReportModel) => {
        report.end = endTimer.end.toString();
        report.save().then(() => {
          response.sendStatus(200);
        }).catch(() => response.sendStatus(500));
      }).catch(() => response.sendStatus(500));
    };
  }
}
