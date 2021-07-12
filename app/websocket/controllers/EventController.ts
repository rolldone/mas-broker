import BaseController from "@root/base/BaseController";
import EventService, { EventServiceInterface } from "../services/EventService";

export interface EventControllerInterface extends BaseControllerInterface {
  returnEventService ?: {():EventServiceInterface}
  generate?: { (props: any): void }
  start?: { (props: any): void }
  stop?: { (props: any): void }
  delete?: { (props: any): void }
  logs?: { (props: any): void }
  startAll ?: {(props:Array<any>):void}
}

export default BaseController.extend<EventControllerInterface>({
  returnEventService : function(){
    return EventService.create();
  },
  generate: function (props) {
    console.log('generate',props);
  },
  start: function (props) {

  },
  stop: function (props) {

  },
  delete: function (props) {

  },
  logs: function (props) {

  },
  startAll : function(props){
    try{
      let eventService = this.returnEventService();
      eventService.startSocketEvents(props);
    }catch(ex){
      /* Log this error or do something here */
      console.log('GroupController - generate - ex ',ex);
    }
  }
});