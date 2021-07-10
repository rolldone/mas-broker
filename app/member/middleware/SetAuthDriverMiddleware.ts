import SetAuthDriverMiddleware from "@root/app/main/middleware/SetAuthDriverMiddleware";
import { BaseMiddlewareInterface } from "@root/base/BaseMiddleware";

export default SetAuthDriverMiddleware.extend<BaseMiddlewareInterface>({
  check(req, res, next) {
    return this._super(req, res, next);
  }
});