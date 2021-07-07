import BaseRoute from "../../base/BaseRoute";
import HomeController from "@root/app/basic/controllers/HomeController";

export default BaseRoute.extend({
  baseRoute : '',
  onready(){
    let self = this;
    self.use('/',[],function(route : BaseRouteInterface){
      route.get('','front.index',[],HomeController.binding().index);
    });
  }
} as BaseRouteInterface)