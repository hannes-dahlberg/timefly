import { ProjectDTO, TaskDTO } from "../../../../shared/dto";
import { ClientViewModel } from "./client.view-model";
import { TaskViewModel } from "./task.view-model";
import { ViewModel } from "./view-model";

export interface IProjectViewModel {
  id: number;
  name: string;
  comment: string;
  client?: ClientViewModel;
  tasks?: TaskViewModel[];
}

export class ProjectViewModel extends ViewModel<IProjectViewModel> implements IProjectViewModel {

  public static fromProjectDTO(project: ProjectDTO): ProjectViewModel {
    return new ProjectViewModel({
      id: project.id,
      name: project.name,
      comment: project.comment,
      ...(project.client ? { client: ClientViewModel.fromClientDTO(project.client) } : null),
      ...(project.tasks ? { tasks: project.tasks.map((task: TaskDTO) => TaskViewModel.fromTaskDTO(task)) } : null),
    });
  }
  public id: number;
  public name: string;
  public comment: string;
  public client?: ClientViewModel;
  public tasks?: TaskViewModel[];
}
