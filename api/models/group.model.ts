import { GroupModel as ArtosGroupModel } from "artos";
import { ClientModel } from "./client.model";
import { ProjectModel } from "./project.model";
import { UserModel } from "./user.model";

export class GroupModel extends ArtosGroupModel {
  public static table = "groups";
  public static fields = ["id", "name"];
  public static fillable = ["name"];
  public _users: UserModel[] = [];
  public _clients: ClientModel[] = [];

  public users() { return this.belongsToMany<UserModel>(UserModel, "users_to_groups", "group_id", "user_id"); }

  public clients() { return this.belongsToMany(ClientModel, "clients_to_groups", "client_id", "group_id"); }
}
