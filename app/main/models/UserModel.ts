import BaseModel, { BaseModelInterface } from "@root/base/BaseModel";
import { User } from "@root/models";


export interface UserModelInterface extends BaseModelInterface {
  password?: string
  id?: string
  email?: string
}

const UserModel = BaseModel.extend<UserModelInterface>({
  model: User,
  _excludes: ['password']
});

export default UserModel;
