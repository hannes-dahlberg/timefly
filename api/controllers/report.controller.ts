import { container } from "artos";
import { Request, RequestHandler, Response } from "express";
import * as moment from "moment";
import { DateTimeModel } from "../../shared/models/date-time.model";
import { ReportModel } from "../models/report.model";
import { UserModel } from "../models/user.model";

import { CreateReportDTO, EditReportDTO, ReportDTO } from "../../shared/dto";
import { middleware, Middlewares } from "../middlewares";
import { Validation } from "../modules/validation";

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
        }).catch(() => response.sendStatus(500));
    };
  }

  public create(): RequestHandler {
    return (request: Request, response: Response): void => {
      // Parse report data from request
      const createReport: CreateReportDTO = CreateReportDTO.parse(request.body);

      // Check if user is owner of provided task
      UserModel
        .with("groups.clients.projects.tasks")
        .where("users.id", request.user.id.toString())
        .where("tasks.id", createReport.taskId.toString())
        .first().then((user: UserModel) => {
          if (user === undefined) { response.sendStatus(400); return; }

          const serializedReport = createReport.serialize();

          // Create report
          ReportModel.create({
            user_id: request.user.id.toString(),
            task_id: serializedReport.taskId.toString(),
            start: serializedReport.start,
            ...(serializedReport.end !== undefined ? { end: serializedReport.end } : null),
            comment: serializedReport.comment,
          }).then(() => response.sendStatus(200)).catch(() => response.sendStatus(500));
        }).catch(() => response.sendStatus(500));
    };
  }

  public update(): RequestHandler {
    return (request: Request, response: Response): void => {
      // Parse report data from request
      const editReport: EditReportDTO = EditReportDTO.parse(request.body);

      // Check ownership of report
      ReportModel
        .where("id", editReport.id.toString())
        .where("user_id", request.user.id.toString())
        .first().then((report: ReportModel) => {
          if (report === undefined) { response.sendStatus(404); return; }
          // Check if user is owner of provided task
          UserModel
            .with("groups.clients.projects.tasks")
            .where("users.id", request.user.id.toString())
            .where("tasks.id", editReport.taskId.toString())
            .first().then((user: UserModel) => {
              if (user === undefined) { response.sendStatus(400); return; }

              const serializedReport = editReport.serialize();

              // Update report data
              report.task_id = serializedReport.taskId;
              report.start = serializedReport.start;
              if (serializedReport.end !== undefined) { report.end = serializedReport.end; }
              report.comment = serializedReport.comment;

              // Save report
              report.save().then(() => response.sendStatus(200)).catch(() => response.sendStatus(500));
            });
        }).catch(() => response.sendStatus(500));
    };
  }

  public remove() {
    return (request: Request, response: Response): void => {
      // Check ownership of report
      ReportModel
        .where("id", request.params.id.toString())
        .where("user_id", request.user.id.toString())
        .first().then((report: ReportModel) => {
          if (report === undefined) { response.sendStatus(404); return; }
          report.delete().then(() => response.sendStatus(200)).catch(() => response.sendStatus(500));
        });
    };
  }
}
