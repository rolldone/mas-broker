import BaseController from "@root/base/BaseController";
import { Response, Request } from "express";
import { AuthInterface } from "../../compute/Auth";
import UserService, { UserServiceInterface } from "../../services/UserService";

declare var Auth : AuthInterface

export interface UserControllerInterface extends BaseControllerInterface {
  returnUserService?:{():UserServiceInterface}
  getCurrentUser?: { (req: Request, res: Response): void }
  updateCurrentUser?: { (req: Request, res: Response): void }
}

const UserController = BaseController.extend<UserControllerInterface>({
  returnUserService : function(){
    return UserService.create();
  },
  getCurrentUser: async function (req, res) {
    try{
      let auth = await Auth.getAuth();
      let resData = {
        status : 'success',
        status_code : 200,
        return : auth
      }
      return res.status(resData.status_code).json(resData);
    }catch(ex){
      return this.returnSimpleError(ex,res);
    }
  },
  updateCurrentUser: async function (req, res) {
    try{
      let props = req.body;
      let userService = this.returnUserService();
      let resData = await userService.updateUser(props);
      resData = {
        status : 'success',
        status_code : 200,
        return : resData
      }
      return res.status(resData.status_code).json(resData);
    }catch(ex){
      return this.returnSimpleError(ex,res);
    }
  }
});

export default UserController;