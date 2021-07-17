import BaseController from "@root/base/BaseController";
import EventService, { EventServiceInterface } from "../services/EventService";

export interface EventControllerInterface extends BaseControllerInterface{
  returnEventService ?: {():EventServiceInterface}
  addAll ?: {(props:Array<any>):Promise<any>}
  add ?: {(props:any):Promise<any>}
  delete ?: {(props:any):Promise<any>}
  get ?: {(props:any):Promise<any>}
}

export default BaseController.extend<EventControllerInterface>({
  returnEventService : function(){
    return EventService.create();
  },
  addAll : async function(props){
    try{
      if(props.length == 0){
        return;
      }
      for(var a=0;a<props.length;a++){
        await this.add(props[a]);
      }
    }catch(ex){
      console.log('RedisClient - EventController - addAll - ex => ');
      console.log(' ',ex);
    }
  },
  add : async function(props){
    try{
      let eventService = this.returnEventService();
      await eventService.add(props);
    }catch(ex){
      console.log('RedisClient - EventController - add - ex => ');
      console.log(' ',ex);
    }
  },
  delete : async function(props){

  },
  get : async function(props){

  },
});