import { Request, Response } from 'express';
import BaseController from "./BaseController";

export interface BaseMiddlewareInterface extends BaseControllerInterface {
  construct ?: {(...props:any|null):void}
  _props ?: any | null
  check : {(req: Request, res : Response,next:Function):void}
}

export default BaseController.extend<BaseMiddlewareInterface>({
  check : function(req,res,next){
    next();
  }
});