import BaseController from "@root/base/BaseController";
import EventService, { EventServiceInterface } from "../services/EventService";
import GroupService, { GroupServiceInterface } from "../services/GroupService";

export interface GroupControllerInterface extends BaseControllerInterface {
  returnGroupService : {(eventService:EventServiceInterface):GroupServiceInterface}
  returnEventService : {():EventServiceInterface}
  generate?: { (props: any): void }
  start?: { (props: any): void }
  stop?: { (props: any): void }
  delete?: { (props: any): void }
  logs?: { (props: any): void }
  startAll?: { (): void }
}

export default BaseController.extend<GroupControllerInterface>({
  returnGroupService : function(eventService){
    return GroupService.create(eventService);
  },
  returnEventService : function(){
    return EventService.create();
  },
  generate: function (props) {
    try{
      let groupService = this.returnGroupService(this.returnEventService());
      groupService.generateSocketGroup(props);
    }catch(ex){
      /* Log this error or do something here */
      console.log('GroupController - generate - ex ',ex);
    }
  },
  start: function (props) {
    try{
      let groupService = this.returnGroupService(this.returnEventService());
      groupService.startSocketGroup(props);
    }catch(ex){
      /* Log this error or do something here */
      console.log('GroupController - generate - ex ',ex);
    }
  },
  stop: function (props) {
    try{
      let groupService = this.returnGroupService(this.returnEventService());
      groupService.stopSocketGroup(props);
    }catch(ex){
      /* Log this error or do something here */
      console.log('GroupController - generate - ex ',ex);
    }
  },
  delete: function (props) {
    try{
      let groupService = this.returnGroupService(this.returnEventService());
      groupService.stopSocketGroup(props);
    }catch(ex){
      /* Log this error or do something here */
      console.log('GroupController - generate - ex ',ex);
    }
  },
  logs: function (props) {
    try{
      let groupService = this.returnGroupService(this.returnEventService());
      groupService.logSocketGroup(props);
    }catch(ex){
      /* Log this error or do something here */
      console.log('GroupController - generate - ex ',ex);
    }
  },
  startAll: function () {
    try{
      let groupService = this.returnGroupService(this.returnEventService());
      groupService.startSocketGroups();
    }catch(ex){
      /* Log this error or do something here */
      console.log('GroupController - generate - ex ',ex);
    }
  }
});