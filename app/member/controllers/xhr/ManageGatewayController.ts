import BaseController from "@root/base/BaseController";
import { Request, Response } from 'express';

export interface ManageGatewayControllerInterface extends BaseControllerInterface {
  addGateway?: { (req: Request, res: Response): void }
  updateGateway?: { (req: Request, res: Response): void }
}

export default BaseController.extend<ManageGatewayControllerInterface>({});