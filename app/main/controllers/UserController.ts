import BaseController from "@root/base/BaseController";
import { Response, Request } from "express";

export interface UserControllerInterface extends BaseControllerInterface {
  getCurrentUser: { (req: Request, res: Response): void }
  updateCurrentUser: { (req: Request, res: Response): void }
}

const UserController = BaseController.extend<UserControllerInterface>({
  getCurrentUser: function (req, res) {

  },
  updateCurrentUser: function (req, res) {
    
  }
});

export default UserController;