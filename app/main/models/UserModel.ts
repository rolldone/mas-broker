import BaseModel, { BaseModelInterface } from "@root/base/BaseModel";
import User from "@root/models/User";

export interface UserModelInterface extends BaseModelInterface{
  password ?: string
  id ?: string
  email ?: string
}

const UserModel = BaseModel.extend<UserModelInterface>({
  model : User
});

export default UserModel;
