import BaseRoute from "../../base/BaseRoute";
import HomeController from "@root/app/main/controllers/HomeController";

export default BaseRoute.extend<BaseRouteInterface>({
  baseRoute : '',
  onready(){
    let self = this;
    /* Main route example */
    self.use('/main',[],function(route){
      route.get('','front.index',[],HomeController.binding().index);
    });

    /* Member route */
    self.use('/',[],function(route){
      route.get('','front.index',[],HomeController.binding().index);
    });
  }
});