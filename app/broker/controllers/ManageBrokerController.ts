import BaseController from "@root/base/BaseController";
import { Request, Response } from 'express';
export interface ManageBrokerControllerInterface extends BaseControllerInterface {
  addBroker?: { (req: Request, res: Response): void }
  updateBroker?: { (req: Request, res: Response): void }
  deleteBroker?: { (req: Request, res: Response): void }
  getBrokers?: { (req: Request, res: Response): void }
  getBroker?: { (req: Request, res: Response): void }
}

export default BaseController.extend<ManageBrokerControllerInterface>({
  addBroker: function (req, res) {
    try {
      
    } catch (ex) {
      return this.returnSimpleError(ex, res);
    }
  },
  updateBroker: function (req, res) {
    try {

    } catch (ex) {
      return this.returnSimpleError(ex, res);
    }
  },
  deleteBroker: function (req, res) {
    try {

    } catch (ex) {
      return this.returnSimpleError(ex, res);
    }
  },
  getBrokers: function (req, res) {
    try {

    } catch (ex) {
      return this.returnSimpleError(ex, res);
    }
  },
  getBroker: function (req, res) {
    try {

    } catch (ex) {
      return this.returnSimpleError(ex, res);
    }
  },
});