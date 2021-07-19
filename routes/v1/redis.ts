import BaseRoute from "../../base/BaseRoute";

export default BaseRoute.extend<BaseRouteInterface>({
  onready() : void {
    let self = this;
    
    /* self.useNrp('emailing',function(route: BaseRouteInterface){
      route.nrpOn('sending.process',EmailingListenerController.binding().redisListenerEmailingListener);
    }); */
    
  }
});