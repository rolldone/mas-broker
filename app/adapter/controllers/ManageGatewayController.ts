import BaseController from "@root/base/BaseController";
import { Request, Response } from 'express';

export interface ManageGatewayController extends BaseControllerInterface{
  getGateways?: { (req: Request, res: Response): void }
  getGateway?: { (req: Request, res: Response): void }
}

export default BaseController.extend<ManageGatewayController>({
  getGateways : function(props){
    
  },
  getGateway : function(props){
    
  },
});