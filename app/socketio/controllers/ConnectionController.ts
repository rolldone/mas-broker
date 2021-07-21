import BaseController from "@root/base/BaseController";
import EventService, { EventServiceInterface } from "../services/EventService";
import GroupService, { ConnectionServiceInterface } from "../services/ConnectionService";

export interface ConnectionControllerInterface extends BaseControllerInterface {
  returnConnectionService : {(eventService:EventServiceInterface):ConnectionServiceInterface}
  returnEventService : {():EventServiceInterface}
  start?: { (props: any): void }
  stop?: { (props: any): void }
  logs?: { (props: any): void }
}

export default BaseController.extend<ConnectionControllerInterface>({
  returnConnectionService : function(eventService){
    return GroupService.create(eventService);
  },
  returnEventService : function(){
    return EventService.create();
  },
  start: function (props) {
    try{
      let groupService = this.returnConnectionService(this.returnEventService());
      groupService.startSocketConnection(props);
    }catch(ex){
      /* Log this error or do something here */
      console.log('ConnectionController - generate - ex ',ex);
    }
  },
  stop: function (props) {
    try{
      let groupService = this.returnConnectionService(this.returnEventService());
      groupService.stopSocketConnection(props);
    }catch(ex){
      /* Log this error or do something here */
      console.log('ConnectionController - generate - ex ',ex);
    }
  },
  logs: function (props) {
    try{
      let groupService = this.returnConnectionService(this.returnEventService());
      groupService.logSocketConnection(props);
    }catch(ex){
      /* Log this error or do something here */
      console.log('ConnectionController - generate - ex ',ex);
    }
  }
});