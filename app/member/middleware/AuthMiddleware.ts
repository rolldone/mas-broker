import MainAuthMiddleware from "@root/app/main/middleware/AuthMiddleware";
import { BaseMiddlewareInterface } from "@root/base/BaseMiddleware";

export default MainAuthMiddleware.extend<BaseMiddlewareInterface>({
  check(req,res,next){
    return this._super(req,res,next);
  }
});