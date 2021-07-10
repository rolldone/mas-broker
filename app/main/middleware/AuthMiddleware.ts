import BaseController from "@root/base/BaseController";
import BaseMiddleware, { BaseMiddlewareInterface } from "@root/base/BaseMiddleware";
import { AuthInterface } from "../compute/Auth";

declare var Auth : AuthInterface;

export default BaseMiddleware.extend<BaseMiddlewareInterface>({
  construct(props : any){
    this._props = props;
  },
  async check(req,res,next){
    try{
      let auth = await Auth.getAuth();
      if(auth == null){
        throw global.CustomError('error.rejected','You have no Unauthorized');
      }
      next();
    }catch(ex){
      return this.returnSimpleError(ex,res);
    }
  }
});