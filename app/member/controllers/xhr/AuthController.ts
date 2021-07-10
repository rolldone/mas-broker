import MainAuthController, { AuthControllerInterface } from "@root/app/main/controllers/xhr/AuthController";
import AuthService from "../../services/AuthService";

const AuthController = MainAuthController.extend<AuthControllerInterface>({
  returnAuthService(){
    return AuthService.create();
  }
});

export default AuthController;