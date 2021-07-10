import UserController, { UserControllerInterface } from "@root/app/main/controllers/xhr/UserController";
import UserService from "../../services/UserService";

export default UserController.extend<UserControllerInterface>({
  returnUserService(){
    return UserService.create();
  }
});