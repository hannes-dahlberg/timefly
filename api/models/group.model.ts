import { GroupModel as ArtooGroupModel } from 'artoo';
import { ProjectModel } from './project.model';
import { ClientModel } from './client.model';
import { UserModel } from './user.model';

export class GroupModel extends ArtooGroupModel {
  public static table = "groups";
  public static fields = ["id", "name"];
  public static fillable = ["name"];

  public users() { return this.belongsToMany<UserModel>(UserModel, "users_to_groups", "group_id", "user_id"); }
  public _users: UserModel[] = [];

  public clients() { return this.belongsToMany(ClientModel, "clients_to_groups", "client_id", "group_id"); }
  public _clients: ClientModel[] = [];
}