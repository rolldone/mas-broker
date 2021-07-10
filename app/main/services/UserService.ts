import BaseService from "@root/base/BaseService";
import { AuthInterface } from "../compute/Auth";
import UserModel, { UserModelInterface } from "../models/UserModel";

declare var Auth: AuthInterface

export interface UserServiceInterface extends BaseServiceInterface {
  updateUser?: { (props: any): Promise<any> }
  returnUserModel?: { (): UserModelInterface }
}

const UserService = BaseService.extend<UserServiceInterface>({
  returnUserModel: function () {
    return UserModel.create();
  },
  updateUser: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        id: 'required',
        first_name: 'required',
        email: 'required',
        status: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let newPassword = null;
      if (props.password != null) {
        validation = this.returnValidator(props, {
          password: 'required|min:8',
          password_confirm: 'required|same:password',
        })
        switch (await validation.check()) {
          case validation.fails:
            throw global.CustomError('error.validation', validation.errors.errors);
        }
        newPassword = await Auth.generatePassword(props.password);
        props.password = newPassword;
      }
      let userModel = this.returnUserModel();
      return userModel.update(props);
    } catch (ex) {
      throw ex;
    }
  }
});

export default UserService;