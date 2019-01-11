import { ViewModel } from "./view-model";
import { ClientDTO, ProjectDTO } from "../../../../shared/dto";
import { ProjectViewModel } from "./project.view-model";

export interface IClientViewModel {
  id: number;
  name: string;
  projects?: ProjectViewModel[];
}

export class ClientViewModel extends ViewModel<IClientViewModel> implements IClientViewModel {
  public id: number;
  public name: string;
  public projects?: ProjectViewModel[];

  public static fromClientDTO(client: ClientDTO) {
    return new ClientViewModel({
      id: client.id,
      name: client.name,
      ...(client.projects ? { projects: client.projects.map((project: ProjectDTO) => ProjectViewModel.fromProjectDTO(project)) } : null)
    });
  }
}