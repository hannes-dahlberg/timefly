import { DTO } from "./dto";
import { TaskDTO, ITaskDTO, ITaskJSON } from "./task.dto";
import { ClientDTO, IClientJSON, IClientDTO } from "./client.dto";

export interface IProject<A, B> {
  id: number;
  name: string;
  comment: string | null;
  client?: A;
  tasks?: B[]
}
export interface IProjectDTO extends IProject<IClientDTO, ITaskDTO> { }
export interface IProjectJSON extends IProject<IClientJSON, ITaskJSON> { }

export class ProjectDTO extends DTO<IProjectDTO> implements IProjectDTO {
  public id: number;
  public name: string;
  public comment: string;
  public client?: ClientDTO;
  public tasks?: TaskDTO[];

  public serialize(): IProjectJSON {
    return {
      id: this.id,
      name: this.name,
      comment: this.comment,
      ...(this.client ? { client: this.client.serialize() } : null),
      ...(this.tasks ? { tasks: this.tasks.map((task: TaskDTO) => task.serialize()) } : null)
    }
  }

  public static parse(object: IProjectJSON): ProjectDTO {
    return new ProjectDTO({
      id: object.id,
      name: object.name,
      comment: object.comment,
      ...(object.client ? { client: ClientDTO.parse(object.client) } : null),
      ...(object.tasks ? { projects: object.tasks.map((task: ITaskJSON) => TaskDTO.parse(task)) } : null)
    });
  }
}