import UserModel, { UserModelInterface as MainUserModelInterface } from "@root/app/main/models/UserModel";
import User from "@root/models/User";

export interface UserModelInterface extends MainUserModelInterface{}
export default UserModel.extend<UserModelInterface>({
  model : User
});