import { AuthInterface } from "@root/app/main/compute/Auth";
import BaseController from "@root/base/BaseController";
import { Request, Response } from 'express';
import BrokerService, { BrokerServiceInterface } from "../../services/BrokerService";
export interface ManageBrokerControllerInterface extends BaseControllerInterface {
  returnBrokerService?: { (): BrokerServiceInterface }
  addBroker?: { (req: Request, res: Response): Promise<any> }
  updateBroker?: { (req: Request, res: Response): Promise<any> }
  deleteBroker?: { (req: Request, res: Response): Promise<any> }
  getBrokers?: { (req: Request, res: Response): Promise<any> }
  getBroker?: { (req: Request, res: Response): Promise<any> }
  getAccessFormats?: { (req: Request, res: Response): Promise<any> }
}

declare var Auth : AuthInterface

export default BaseController.extend<ManageBrokerControllerInterface>({
  returnBrokerService: function () {
    return BrokerService.create();
  },
  addBroker: async function (req, res) {
    try {
      let props = req.body;
      let brokerService = this.returnBrokerService();
      let resData = await brokerService.addBroker(props) as any;
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
  updateBroker: async function (req, res) {
    try {
      let props = req.body;
      let brokerService = this.returnBrokerService();
      let resData = await brokerService.updateBroker(props) as any;
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
  deleteBroker: async function (req, res) {
    try {
      let props = req.body;
      let brokerService = this.returnBrokerService();
      let resData = brokerService.deleteBroker(props) as any;
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
  getBrokers: async function (req, res) {
    try {
      let props = this.getBaseQuery(req, {});
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let brokerService = this.returnBrokerService();
      let resData = await brokerService.getBrokers(props) as any;
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
  getBroker: async function (req, res) {
    try {
      let props = this.getBaseQuery(req, {
        id : req.params.id
      });
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let brokerService = this.returnBrokerService();
      let resData = await brokerService.getBroker(props) as any;
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
      let brokerService = this.returnBrokerService();
      let resData = await brokerService.getAccessFormats() as any;
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