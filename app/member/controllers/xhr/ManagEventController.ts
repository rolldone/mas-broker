import { AuthInterface } from "@root/app/main/compute/Auth";
import BaseController from "@root/base/BaseController";
import { Response, Request } from "express";
import { UserModelInterface } from "../../models/UserModel";
import EventService, { EventServiceInterface } from "../../services/EventService";

declare var Auth : AuthInterface

export interface ManageEventControllerInterface extends BaseControllerInterface {
  returnEventService ?: {():EventServiceInterface}
  getEvents: { (req: Request, res: Response): void }
  getEvent: { (req: Request, res: Response): void }
  addEvent: { (req: Request, res: Response): void }
  updateEvent: { (req: Request, res: Response): void }
  deleteEvent: { (req: Request, res: Response): void }
}

const ManageEventController = BaseController.extend<ManageEventControllerInterface>({
  returnEventService : function(){
    return EventService.create();
  },
  getEvents: async function (req, res) {
    try{
      let props = req.query;
      let user = await Auth.getAuth() as UserModelInterface;
      props.user_id = user.id;
      let eventService = this.returnEventService();
      let resData = await eventService.getEvents(props);
      resData = {
        status : 'success',
        status_code : 200,
        return : resData
      }
      return res.status(resData.status_code).json(resData);
    }catch(ex){
      return this.returnSimpleError(ex,res);
    }
  },
  getEvent: async function (req, res) {
    try{
      let props = req.query;
      props.id = req.params.id;
      let user = await Auth.getAuth() as UserModelInterface;
      props.user_id = user.id;
      let eventService = this.returnEventService();
      let resData = await eventService.getEvent(props);
      resData = {
        status : 'success',
        status_code : 200,
        return : resData
      }
      return res.status(resData.status_code).json(resData);
    }catch(ex){
      return this.returnSimpleError(ex,res);
    }
  },
  addEvent: async function (req, res) {
    try{
      let props = req.body;
      let user = await Auth.getAuth() as UserModelInterface;
      props.user_id  = user.id;
      let eventService = this.returnEventService();
      let resData = await eventService.addEvent(props);
      resData = {
        status : 'success',
        status_code : 200,
        return : resData
      }
      return res.status(resData.status_code).json(resData);
    }catch(ex){
      return this.returnSimpleError(ex,res);
    }
  },
  updateEvent: async function (req, res) {
    try{
      let props = req.body;
      let user = await Auth.getAuth() as UserModelInterface;
      props.user_id  = user.id;
      let eventService = this.returnEventService();
      let resData = await eventService.updateEvent(props);
      resData = {
        status : 'success',
        status_code : 200,
        return : resData
      }
      return res.status(resData.status_code).json(resData);
    }catch(ex){
      return this.returnSimpleError(ex,res);
    }
  },
  deleteEvent: async function (req, res) {
    try{
      
    }catch(ex){
      return this.returnSimpleError(ex,res);
    }
  }
});

export default ManageEventController;