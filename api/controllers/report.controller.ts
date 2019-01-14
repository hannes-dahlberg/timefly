import { ConfigService, container, ParametersType, RelationModule } from "artos";
import { NextFunction, Request, RequestHandler, Response } from "express";
import * as moment from "moment";
import { DateTimeModel } from "../../shared/models/date-time.model";
import { ReportModel } from "../models/report.model";
import { UserModel } from "../models/user.model";

import { ReportDTO, StartTimerDTO, TaskDTO, UserDTO } from "../../shared/dto";
import { middleware, Middlewares } from "../middlewares";
import { Validation, validation } from "../modules/validation";

const middlewares: Middlewares = container.getService(Middlewares, { useName: "service.middlewares" });

export class ReportController {
  public constructor(
    private readonly dateTimeModel: typeof DateTimeModel = container.get<typeof DateTimeModel>("model.dateTime", DateTimeModel),
  ) { }

  @middleware(middlewares.validation({ date: [Validation.required, Validation.date()] }))
  public index(): RequestHandler {
    return (request: Request, response: Response): void => {
      const start: Date = moment(`${request.query.date} 00:00:00`).toDate();
      const end: Date = moment(`${request.query.date} 23:59:59`).toDate();
      ReportModel.with("task.project.client").where("user_id", request.user.id.toString())
        .where({ column: "start", operator: ">=", value: (new this.dateTimeModel(start)).toString() })
        .where({ column: "start", operator: "<=", value: (new this.dateTimeModel(end)).toString() })
        .orderBy("start", true)
        .get().then((reports: ReportModel[]) => {
          response.json(reports.map((report: ReportModel) => ReportDTO.parse({
            id: report.id,
            user: { id: request.user.id, email: request.user.email },
            ...(report._task !== null ? {
              task: {
                id: report._task.id,
                name: report._task.name,
                ...(report._task._project ? {
                  project: {
                    id: report._task._project.id,
                    name: report._task._project.name,
                    comment: report._task._project.comment,
                    ...(report._task._project._client !== null ? { client: { id: report._task._project._client.id, name: report._task._project._client.name } } : null),
                  },
                } : null),
              },
            } : null),
            start: report.start,
            end: report.end,
            comment: report.comment,
          }).serialize()));
        }).catch((error: any) => { console.log(error); response.sendStatus(500); });
    };
  }
}
