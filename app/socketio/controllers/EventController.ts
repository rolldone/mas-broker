import BaseController from "@root/base/BaseController";
import EventService, { EventServiceInterface } from "../services/EventService";

export interface EventControllerInterface extends BaseControllerInterface {
  returnEventService?: { (): EventServiceInterface }
  generate?: { (props: any): void }
  start?: { (props: any): void }
  stop?: { (props: any): void }
  delete?: { (props: any): void }
  get?:{(props:any):void}
  logs?: { (props: any): void }
  log?: { (props: any): void }
  startAll?: { (props: Array<any>): void }
  emit ?: {(props:any):void}
}

export default BaseController.extend<EventControllerInterface>({
  returnEventService: function () {
    return EventService.create();
  },
  generate: function (props) {
    console.log('generate', props);
  },
  start: function (props) {
    try {
      let eventService = this.returnEventService();
      eventService.startSocketEvent(props);
    } catch (ex) {
      /* Log this error or do something here */
      console.log('EventController - start - ex ', ex);
    }
  },
  stop: function (props) {
    try {
      let eventService = this.returnEventService();
      eventService.stopSocketEvent(props);
    } catch (ex) {
      /* Log this error or do something here */
      console.log('EventController - stop - ex ', ex);
    }
  },
  delete: function (props) {
    try {
      let eventService = this.returnEventService();
      eventService.deleteSocketEvent(props);
    } catch (ex) {
      /* Log this error or do something here */
      console.log('EventController - delete - ex ', ex);
    }
  },
  get : function(props){
    try {

    } catch (ex) {
      /* Log this error or do something here */
      console.log('EventController - get - ex ', ex);
    }
  },
  logs: function (props) {
    try {
      let eventService = this.returnEventService();
      eventService.logSocketEvents(props);
    } catch (ex) {
      /* Log this error or do something here */
      console.log('EventController - delete - ex ', ex);
    }
  },
  log: function (props) {
    try {
      let eventService = this.returnEventService();
      eventService.logSocketEvent(props);
    } catch (ex) {
      /* Log this error or do something here */
      console.log('EventController - delete - ex ', ex);
    }
  },
  startAll: function (props) {
    try {
      console.log('iiiiiiiiiiiiiiiiiiiii',props);
      let eventService = this.returnEventService();
      eventService.startSocketEvents(props);
    } catch (ex) {
      /* Log this error or do something here */
      console.log('EventController - generate - ex ', ex);
    }
  },
  emit : function(props){
    try{
      let eventService = this.returnEventService();
      eventService.emit(props);
    }catch(ex){
      console.log('EventController - emit - ex ', ex);
    }
  }
});