import { DTO } from "./dto";
import { IProjectDTO, IProjectJSON, ProjectDTO } from "./project.dto";

export interface IClient<A> {
  id: number;
  name: string;
  projects?: A[];
}

export interface IClientDTO extends IClient<IProjectDTO> { }
export interface IClientJSON extends IClient<IProjectJSON> { }

export class ClientDTO extends DTO<IClientDTO> implements IClientDTO {

  public static parse(object: IClientJSON): ClientDTO {
    return new ClientDTO({
      id: object.id,
      name: object.name,
      ...(object.projects ? { projects: object.projects.map((project: IProjectJSON) => ProjectDTO.parse(project)) } : null),
    });
  }
  public id: number;
  public name: string;
  public projects?: ProjectDTO[];

  public serialize(): IClientJSON {
    return {
      id: this.id,
      name: this.name,
      ...(this.projects ? { projects: this.projects.map((project: ProjectDTO) => project.serialize()) } : null),
    };
  }
}
