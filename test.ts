import { UserModel } from "./api/models/user.model";
UserModel.get().then((users: UserModel[]) => {
  console.log(users);
  console.log(users[users.length - 1].createdAt);
})

//UserModel.create({ email: 'gunnar@dwik.se' })
//new UserModel({ email: 'rolf@dwik.se' }).save()


console.log(UserModel.allFields);