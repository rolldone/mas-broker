import BaseMiddleware, { BaseMiddlewareInterface } from "@root/base/BaseMiddleware";
import { AuthInterface } from "../compute/Auth";
declare var Auth : AuthInterface;

export default BaseMiddleware.extend<BaseMiddlewareInterface>({
  construct(props: any) {
    this._props = props;
  },
  async check(req, res, next) {
    try{
      let validation = this.returnValidator({
        'guard_name' : this._props
      },{
        'guard_name' : 'required'
      });
      switch(await validation.check()){
        case validation.fails == true:
          throw global.CustomError('error.validation',validation.errors.errors);
      }
      Auth.setDefaultGuard(this._props,req);
      next();
    }catch(ex){
      switch(ex.name){
        case 'error.token_invalid':
          res.status(401);
          res.json('You have no authorized');
          res.end();
          break;
        default:
          this.returnSimpleError(ex,res);
          return;
      }
    }
  }
});