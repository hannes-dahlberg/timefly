import { UserModel } from "artos";
import { Request, RequestHandler, Response } from "express";
import { ClientDTO, ProjectDTO, TaskDTO } from "../../shared/dto";
import { ClientModel, GroupModel, ProjectModel } from "../models";
import { TaskModel } from "../models/task.model";

export class ClientController {
  public index(): RequestHandler {
    return (request: Request, response: Response): void => {
      ClientModel.with(["projects.tasks", "groups.users"])
        .where("users.id", request.user.id.toString())
        .get().then((clients: ClientModel[]) => {
          response.json(clients.map((client: ClientModel) => new ClientDTO({
            id: client.id,
            name: client.name,
            projects: client._projects.map((project: ProjectModel) => new ProjectDTO({
              id: project.id,
              name: project.name,
              comment: project.comment,
              tasks: project._tasks.map((task: TaskModel) => new TaskDTO({
                id: task.id,
                name: task.name,
              })),
            })),
          })));
        });
    };
  }
}
