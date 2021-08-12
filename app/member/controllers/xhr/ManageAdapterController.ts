import { AuthInterface } from "@root/app/main/compute/Auth";
import BaseController from "@root/base/BaseController";
import { Request, Response } from 'express';
import AdapterService, { AdapterServiceInterface } from "../../services/AdapterService";
export interface ManageAdapterControllerInterface extends BaseControllerInterface {
  returnAdapterService?: { (): AdapterServiceInterface }
  addAdapter?: { (req: Request, res: Response): Promise<any> }
  updateAdapter?: { (req: Request, res: Response): Promise<any> }
  deleteAdapter?: { (req: Request, res: Response): Promise<any> }
  getAdapters?: { (req: Request, res: Response): Promise<any> }
  getAdapter?: { (req: Request, res: Response): Promise<any> }
  getAccessFormats?: { (req: Request, res: Response): Promise<any> }
}

declare var Auth: AuthInterface

export default BaseController.extend<ManageAdapterControllerInterface>({
  returnAdapterService: function () {
    return AdapterService.create();
  },
  addAdapter: async function (req, res) {
    try {
      let props = req.body;
      let eventService = this.returnAdapterService();
      let user: any = await Auth.getAuth();
      props.user_id = user.id;
      let resData = await eventService.addAdapter(props) as any;
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
  updateAdapter: async function (req, res) {
    try {
      let props = req.body;
      let eventService = this.returnAdapterService();
      let resData = await eventService.updateAdapter(props) as any;
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
  deleteAdapter: async function (req, res) {
    try {
      let props = req.body;
      let eventService = this.returnAdapterService();
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let resData = eventService.deleteAdapter(props) as any;
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
  getAdapters: async function (req, res) {
    try {
      let props = this.getBaseQuery(req, {});
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let eventService = this.returnAdapterService();
      let resData = await eventService.getAdapters(props) as any;
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
  getAdapter: async function (req, res) {
    try {
      let props = this.getBaseQuery(req, {
        id: req.params.id
      });
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let eventService = this.returnAdapterService();
      let resData = await eventService.getAdapter(props) as any;
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
  getAccessFormats: async function (req, res) {
    try {
      let props = this.getBaseQuery(req, {});
      let eventService = this.returnAdapterService();
      let resData = await eventService.getAccessFormats() as any;
      resData = {
        status: 'success',
        status_code: 200,
        return: resData
      }
      return res.status(resData.status_code).json(resData);
    } catch (ex) {
      return this.returnSimpleError(ex, res);
    }
  }
});