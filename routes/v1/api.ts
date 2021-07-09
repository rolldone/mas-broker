import HomeController from "@root/app/basic/controllers/xhr/HomeController";
import AuthController from "@root/app/main/controllers/AuthController";
import UserController from "@root/app/main/controllers/UserController";
import SetAuthMiddleware from "@root/app/main/middleware/SetAuthMiddleware";
import BaseRoute from "../../base/BaseRoute";

export default BaseRoute.extend<BaseRouteInterface>({
  baseRoute: '/api/v1',
  onready() {
    let self = this;
    self.use('', [], function (route) {
      route.get('', 'home.index', [], HomeController.binding().index);
    });
    self.use('/auth', [], function (route) {
      route.post('/login', 'auth.login', [], AuthController.binding().apiLogin);
      route.post('/register', 'auth.register', [], AuthController.binding().register);
      route.post('/logout', 'auth.logout', [], AuthController.binding().logout);
    });
    self.use('/auth',[SetAuthMiddleware.bind('api')],function(route){
      route.get('/profile', 'auth.profile', [], AuthController.binding().profile);
    });
    self.use('/user', [], function (route) {
      route.get('/self', 'user.self', [], UserController.binding().getCurrentUser);
      route.post('/self/update', 'user.self.update', [], UserController.binding().updateCurrentUser);
    });
  }
});