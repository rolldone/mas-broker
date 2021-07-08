import BaseController from "@root/base/BaseController";
import { Response, Request } from "express";
export interface AuthControllerInterface extends BaseControllerInterface {
  construct: { (props: any): void }
  basicLogin: { (req: Request, res: Response): void }
  apiLogin: { (req: Request, res: Response): void }
  register: { (req: Request, res: Response): void }
  logout: { (req: Request, res: Response): void }
  profile: { (req: Request, res: Response): void }
}

const AuthController = BaseController.extend<AuthControllerInterface>({
  construct(props) {

  },
  basicLogin(req, res) {
  },
  apiLogin(req, res) {

  },
  register(req, res) {

  },
  logout(req, res) {

  },
  profile(req, res) {

    res.send('mvfkvmkfv');
  }
});

export default AuthController;