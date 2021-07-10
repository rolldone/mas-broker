import BaseController from "@root/base/BaseController";
import { Response, Request } from "express";
import { AuthInterface } from "../../compute/Auth";
import AuthService, { AuthServiceInterface } from "../../services/AuthService";
export interface AuthControllerInterface extends BaseControllerInterface {
  construct?: { (props: any): void }
  basicLogin?: { (req: Request, res: Response): void }
  apiLogin?: { (req: Request, res: Response): void }
  register?: { (req: Request, res: Response): void }
  logout?: { (req: Request, res: Response): void }
  profile?: { (req: Request, res: Response): void }
  returnAuthService?: { (): AuthServiceInterface }
}

declare var Auth : AuthInterface;

const AuthController = BaseController.extend<AuthControllerInterface>({
  returnAuthService() {
    return AuthService.create();
  },
  construct(props) {

  },
  basicLogin(req, res) {

  },
  async apiLogin(req, res) {
    try {
      let props = req.body;
      let authService = this.returnAuthService();
      let resData = await authService.apiLogin(props);
      resData = {
        status: 'success',
        status_code: 200,
        return: resData
      }
      return res.status(resData.status_code).send(resData);
    } catch (ex) {
      return this.returnSimpleError(ex, res);
    }
  },
  async register(req, res) {
    try {
      let props: any = {};
      props.first_name = req.body.first_name;
      props.last_name = req.body.last_name;
      props.email = req.body.email;
      props.password = req.body.password;
      props.password_confirm = req.body.password_confirm;
      let authService = this.returnAuthService();
      let resData = await authService.register(props);
      resData = {
        status: 'success',
        status_code: 200,
        return: resData
      }
      return res.status(resData.status_code).send(resData);
    } catch (ex) {
      return this.returnSimpleError(ex, res);
    }

  },
  logout(req, res) {

  },
  async profile(req, res) {
    try{
      let resData = {
        status : 'success',
        status_code : 200,
        return : await Auth.getAuth()
      }
      res.status(resData.status_code);
      res.json(resData);
    }catch(ex){
      return this.returnSimpleError(ex,res);
    }
  }
});

export default AuthController;