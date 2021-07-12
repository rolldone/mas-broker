import UserModel, { UserModelInterface as MainUserModelInterface } from "@root/app/main/models/UserModel";
import { Event, Group, User } from "@root/models";

User.hasMany(Group,{
  foreignKey : 'user_id',
  as : 'groups'
});

User.hasMany(Event,{
  foreignKey : 'user_id',
  as : 'events'
})

export interface UserModelInterface extends MainUserModelInterface{}
export default UserModel.extend<UserModelInterface>({
  model : User
});