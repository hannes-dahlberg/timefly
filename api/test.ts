import { ClientModel, ProjectModel } from "./models";
import { ClientDTO, ProjectDTO, TaskDTO } from "../shared/dto";
import { TaskModel } from "./models/task.model";

ClientModel.with(['projects.tasks', 'groups.users'])
  .where('users.id', '1')
  .get().then((clients: ClientModel[]) => {
    let clientsJson: any = clients.map((client: ClientModel) => new ClientDTO({
      id: client.id,
      name: client.name,
      projects: client._projects.map((project: ProjectModel) => new ProjectDTO({
        id: project.id,
        name: project.name,
        comment: project.comment,
        tasks: project._tasks.map((task: TaskModel) => new TaskDTO({
          id: task.id,
          name: task.name
        }))
      }))
    }));
  });