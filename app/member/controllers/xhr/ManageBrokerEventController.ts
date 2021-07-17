import { AuthInterface } from "@root/app/main/compute/Auth";
import BaseController from "@root/base/BaseController";
import { Request, Response } from 'express';
import BrokerEventService, { BrokerEventServiceInterface } from "../../services/BrokerEventService";

export interface ManageBrokerEventControllerInterface extends BaseControllerInterface {
  returnBrokerEventService?: { (): BrokerEventServiceInterface }
  addEvent?: { (req: Request, res: Response): Promise<any> }
  updateEvent?: { (req: Request, res: Response): Promise<any> }
  deleteEvent?: { (req: Request, res: Response): Promise<any> }
  getEvent?: { (req: Request, res: Response): Promise<any> }
  getEvents?: { (req: Request, res: Response): Promise<any> }
}

declare var Auth: AuthInterface

export default BaseController.extend<ManageBrokerEventControllerInterface>({
  returnBrokerEventService: function () {
    return BrokerEventService.create();
  },
  addEvent: async function (req, res) {
    try {
      let props = req.body;
      let brokerEventService = this.returnBrokerEventService();
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let resData = await brokerEventService.addEvent(props);
      resData = {
        status: 'success',
        status_code: 200,
        return: resData
      }
      return res.status(resData.status_code).json(resData);
    } catch (ex) {
      return this.returnSimpleError(ex, res);
    }
  },
  updateEvent: async function (req, res) {
    try {
      let props = req.body;
      let brokerEventService = this.returnBrokerEventService();
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let resData = await brokerEventService.updateEvent(props);
      resData = {
        status: 'success',
        status_code: 200,
        return: resData
      }
      return res.status(resData.status_code).json(resData);
    } catch (ex) {
      return this.returnSimpleError(ex, res);
    }
  },
  deleteEvent: async function (req, res) {
    try {
      let props = req.body;
      let brokerEventService = this.returnBrokerEventService();
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let resData = await brokerEventService.deleteEvent(props);
      resData = {
        status: 'success',
        status_code: 200,
        return: resData
      }
      return res.status(resData.status_code).json(resData);
    } catch (ex) {
      return this.returnSimpleError(ex, res);
    }
  },
  getEvent: async function (req, res) {
    try {
      let props = this.getBaseQuery(req, {
        id: req.params.id
      });
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let brokerEventService = this.returnBrokerEventService();
      let resData = await brokerEventService.getEvent(props);
      resData = {
        status: 'success',
        status_code: 200,
        return: resData
      }
      return res.status(resData.status_code).json(resData);
    } catch (ex) {
      return this.returnSimpleError(ex, res);
    }
  },
  getEvents: async function (req, res) {
    try {
      let props = this.getBaseQuery(req, {});
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let brokerEventService = this.returnBrokerEventService();
      let resData = await brokerEventService.getEvents(props);
      resData = {
        status: 'success',
        status_code: 200,
        return: resData
      }
      return res.status(resData.status_code).json(resData);
    } catch (ex) {
      return this.returnSimpleError(ex, res);
    }
  },
});