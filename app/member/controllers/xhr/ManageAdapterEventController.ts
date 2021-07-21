import { AuthInterface } from "@root/app/main/compute/Auth";
import BaseController from "@root/base/BaseController";
import { Request, Response } from 'express';
import AdapterEventService, { AdapterEventServiceInterface } from "../../services/AdapterEventService";

export interface ManageAdapterEventControllerInterface extends BaseControllerInterface {
  returnAdapterEventService?: { (): AdapterEventServiceInterface }
  addEvent?: { (req: Request, res: Response): Promise<any> }
  updateEvent?: { (req: Request, res: Response): Promise<any> }
  deleteEvent?: { (req: Request, res: Response): Promise<any> }
  getEvent?: { (req: Request, res: Response): Promise<any> }
  getEvents?: { (req: Request, res: Response): Promise<any> }
}

declare var Auth: AuthInterface

export default BaseController.extend<ManageAdapterEventControllerInterface>({
  returnAdapterEventService: function () {
    return AdapterEventService.create();
  },
  addEvent: async function (req, res) {
    try {
      let props = req.body;
      let adapterEventService = this.returnAdapterEventService();
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let resData = await adapterEventService.addEvent(props);
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
      let adapterEventService = this.returnAdapterEventService();
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let resData = await adapterEventService.updateEvent(props);
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
      let adapterEventService = this.returnAdapterEventService();
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let resData = await adapterEventService.deleteEvent(props);
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
      let adapterEventService = this.returnAdapterEventService();
      let resData = await adapterEventService.getEvent(props);
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
      let adapterEventService = this.returnAdapterEventService();
      let resData = await adapterEventService.getEvents(props);
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