import { container, HashService, StorageService } from "artos";
import { UserModel } from "./models";

const storageService: StorageService = container.getService(StorageService);

storageService.execute(`
  DELETE FROM [claims];
  DELETE FROM [clients];
  DELETE FROM [clients_to_groups];
  DELETE FROM [groups];
  DELETE FROM [groups_to_claims];
  DELETE FROM [projects];
  DELETE FROM [reports];
  DELETE FROM [tasks];
  DELETE FROM [users];
  DELETE FROM [users_to_claims];
  DELETE FROM [users_to_groups];
`).then(() => {
  UserModel.create({ email: "test@test.test", password: "test" }).then((user: UserModel) => {
    user.fill({
      _groups: [{
        name: "admin",
        _clients: [{
          name: "Client1",
          _projects: [
            {
              name: "Project1",
              _tasks: [{ name: "Task1" }, { name: "Task2" }, { name: "Task3" }],
            }, {
              name: "Project2",
              _tasks: [{ name: "Task4" }, { name: "Task5" }],
            },
          ],
        }, {
          name: "Client2",
          _projects: [
            {
              name: "project3",
              _tasks: [{ name: "Task6" }],
            },
          ],
        }],
      }],
    }, { relation: "groups.clients.projects.tasks", explicit: true }).then(() => {
      UserModel.with("groups.clients.projects.tasks").find(user.id).then((user: UserModel) => {
        console.log(user._groups[0]._clients[0]);
      });
    }).catch((error) => console.log(error));
  }).catch((error: any) => console.log(error));
}).catch((error: any) => console.log(error));
