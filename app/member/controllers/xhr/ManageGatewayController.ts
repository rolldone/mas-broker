import { AuthInterface } from "@root/app/main/compute/Auth";
import BaseController from "@root/base/BaseController";
import { Request, Response } from 'express';
import GatewayService, { GatewayServiceInterface } from "../../services/GatewayService";

export interface ManageGatewayControllerInterface extends BaseControllerInterface {
  returnGatewayService?: { (): GatewayServiceInterface }
  addGateway?: { (req: Request, res: Response): Promise<any> }
  updateGateway?: { (req: Request, res: Response): Promise<any> }
  getGateway?: { (req: Request, res: Response): Promise<any> }
  getGateways?: { (req: Request, res: Response): Promise<any> }
  deleteGateway?: { (req: Request, res: Response): Promise<any> }
  getMiddlewareCollections?: { (req: Request, res: Response): Promise<any> }
}

declare var Auth: AuthInterface

export default BaseController.extend<ManageGatewayControllerInterface>({
  returnGatewayService: function () {
    return GatewayService.create();
  },
  getMiddlewareCollections: async function (req, res) {
    try {
      let props = this.getBaseQuery(req, {
        type: req.query.type,
        access_name: req.query.access_name
      });
      let gatewayService = this.returnGatewayService();
      let resData = await gatewayService.getMiddlewareCollections(props);
      resData = {
        status: 'success',
        status_code: 200,
        return: resData
      }
      return res.status(resData.status_code).json(resData);
    } catch (ex) {
      console.log('Member - ManageGatewayController - addGateway - ex => ')
      console.log(' ', ex);
      return this.returnSimpleError(ex, res);
    }
  },
  addGateway: async function (req, res) {
    try {
      let props = req.body;
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let gatewayService = this.returnGatewayService();
      let resData = await gatewayService.addGateway(props);
      resData = {
        status: 'success',
        status_code: 200,
        return: resData
      }
      return res.status(resData.status_code).json(resData);
    } catch (ex) {
      console.log('Member - ManageGatewayController - addGateway - ex => ')
      console.log(' ', ex);
      return this.returnSimpleError(ex, res);
    }
  },
  updateGateway: async function (req, res) {
    try {
      let props = req.body;
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let gatewayService = this.returnGatewayService();
      let resData = await gatewayService.updateGateway(props)
      resData = {
        status: 'success',
        status_code: 200,
        return: resData
      }
      return res.status(resData.status_code).json(resData);
    } catch (ex) {
      console.log('Member - ManageGatewayController - updateGateway - ex => ')
      console.log(' ', ex);
      return this.returnSimpleError(ex, res);
    }
  },
  getGateway: async function (req, res) {
    try {
      let props = this.getBaseQuery(req, {
        id: req.params.id
      });
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let gatewayService = this.returnGatewayService();
      let resData = await gatewayService.getGateway(props);
      resData = {
        status: 'success',
        status_code: 200,
        return: resData
      }
      return res.status(resData.status_code).json(resData);
    } catch (ex) {
      console.log('Member - ManageGatewayController - getGateway - ex => ')
      console.log(' ', ex);
    }
  },
  getGateways: async function (req, res) {
    try {
      let props = this.getBaseQuery(req, {});
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let gatewayService = this.returnGatewayService();
      let resData = await gatewayService.getGateways(props);
      resData = {
        status: 'success',
        status_code: 200,
        return: resData
      }
      return res.status(resData.status_code).json(resData);
    } catch (ex) {
      console.log('Member - ManageGatewayController - getGateways - ex => ')
      console.log(' ', ex);
      return this.returnSimpleError(ex, res);
    }
  },
  deleteGateway: async function (req, res) {
    try {
      let props = req.body;
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let gatewayService = this.returnGatewayService();
      let resData = await gatewayService.deleteGateway(props);
      resData = {
        status: 'success',
        status_code: 200,
        return: resData
      }
      return res.status(resData.status_code).json(resData);
    } catch (ex) {
      console.log('Member - ManageGatewayController - updateGateway - ex => ')
      console.log(' ', ex);
      return this.returnSimpleError(ex, res);
    }
  },
});