import MockupListenerController from "@root/app/broadcast/controllers/events/MockupListenerController";
import MockupDocumentListenerController from "@root/app/broadcast/controllers/events/MockupDocumentListenerController";
import BaseRoute from "../../base/BaseRoute";
import PreRegisterListenerController from "@root/app/broadcast/controllers/events/PreRegisterListenerController";
import EmailingListenerController from "@root/app/broadcast/controllers/events/EmailingListenerController";

export default BaseRoute.extend<BaseRouteInterface>({
  onready() : void {
    let self = this;
    self.useNrp('mockup',function(route : BaseRouteInterface){
      route.nrpOn('self.mockup.documents',MockupDocumentListenerController.binding().redisListenSelfMockupsDocuments);
      route.nrpOn('other.mockup.documents', MockupDocumentListenerController.binding().redisListenOtherMockupsDocuments);
      route.nrpOn('sponsor.mockups', MockupDocumentListenerController.binding().redisListenSelfMockupSponsors);
      route.nrpOn('mockups',MockupListenerController.binding().redisListenMockups);
    })
    self.useNrp('pre_register',function(route: BaseRouteInterface){
      route.nrpOn("import.process",PreRegisterListenerController.binding().redisListenPreRegisterInsert);
      route.nrpOn("import.user_record",PreRegisterListenerController.binding().redisListenPreRegisterInsert);
      route.nrpOn("user.run_register",PreRegisterListenerController.binding().redisListenPreRegisterInsert);
      route.nrpOn('process.log_record_user',PreRegisterListenerController.binding().redisListenPreRegisterInsert);
      route.nrpOn('process.remaining_process',PreRegisterListenerController.binding().redisListenPreRegisterInsert);
    });
    self.useNrp('emailing',function(route: BaseRouteInterface){
      route.nrpOn('sending.process',EmailingListenerController.binding().redisListenerEmailingListener);
    });
    
  }
});