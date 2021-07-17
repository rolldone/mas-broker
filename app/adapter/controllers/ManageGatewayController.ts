import BaseController from "@root/base/BaseController";
import { Request, Response } from 'express';

export interface ManageGatewayController extends BaseControllerInterface{
  addGateway?: { (req: Request, res: Response): void }
  updateGateway?: { (req: Request, res: Response): void }
  deleteGateway?: { (req: Request, res: Response): void }
  getGateways?: { (req: Request, res: Response): void }
  getGateway?: { (req: Request, res: Response): void }
}

export default BaseController.extend<ManageGatewayController>({
  
});