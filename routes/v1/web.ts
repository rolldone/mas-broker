import BaseRoute from "../../base/BaseRoute";
import MainHomeController from "@root/app/main/controllers/HomeController";
import MemberHomeController from "@root/app/member/controllers/xhr/HomeController";

export default BaseRoute.extend<BaseRouteInterface>({
  baseRoute : '',
  onready(){
    let self = this;
    /* Main route example */
    self.use('/main',[],function(route){
      route.get('','front.index',[],MainHomeController.binding().index);
    });

    /* Member route */
    self.use('/',[],function(route){
      route.get('','front.index',[],MemberHomeController.binding().index);
    });
  }
});