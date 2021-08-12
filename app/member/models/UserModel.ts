import UserModel, { UserModelInterface as MainUserModelInterface } from "@root/app/main/models/UserModel";
import { User } from "@root/sequelize/models";

export interface UserModelInterface extends MainUserModelInterface{}
export default UserModel.extend<UserModelInterface>({
  model : User
});