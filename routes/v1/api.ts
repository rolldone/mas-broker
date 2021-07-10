import HomeController from "@root/app/main/controllers/xhr/HomeController";
import AuthController from "@root/app/main/controllers/xhr/AuthController";
import UserController from "@root/app/main/controllers/xhr/UserController";
import SetAuthDriverMiddleware from "@root/app/main/middleware/SetAuthDriverMiddleware";
import AuthMiddleware from "@root/app/main/middleware/AuthMiddleware";
import BaseRoute from "../../base/BaseRoute";
import api from "@root/app/member/routes/api";

export default BaseRoute.extend<BaseRouteInterface>({
  baseRoute: '/api/v1',
  onready() {
    let self = this;

    /* Main route example */
    self.use('/main', [], function (route) {
      route.get('', 'home.index', [], HomeController.binding().index);
    });

    self.use('/main/auth', [], function (route) {
      route.post('/login', 'auth.login', [], AuthController.binding().apiLogin);
      route.post('/register', 'auth.register', [], AuthController.binding().register);
      route.post('/logout', 'auth.logout', [], AuthController.binding().logout);
    });

    self.use('/main/auth', [
      SetAuthDriverMiddleware.binding('api').check,
      AuthMiddleware.binding().check
    ], function (route) {
      route.get('/profile', 'auth.profile', [], AuthController.binding().profile);
    });

    self.use('/main/user', [
      SetAuthDriverMiddleware.binding('api').check,
      AuthMiddleware.binding().check
    ], function (route) {
      route.get('/self', 'user.self', [], UserController.binding().getCurrentUser);
      route.post('/self/update', 'user.self.update', [], UserController.binding().updateCurrentUser);
    });

    /* Register member api route */
    api.create(self);
  }
});