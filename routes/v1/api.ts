import HomeController from "@root/app/basic/controllers/xhr/HomeController";
import BaseRoute from "../../base/BaseRoute";

export default BaseRoute.extend({
  baseRoute: '/api/v1',
  onready() : void {
    let self = this;
    self.use('',[],function(route : BaseRouteInterface){
      route.get('','home.index',[],HomeController.binding().index);
    });
  }
} as BaseRouteInterface);