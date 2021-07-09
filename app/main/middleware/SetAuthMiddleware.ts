import { AuthInterface } from '@root/app/main/compute/Auth';
import { Request, Response } from 'express';
declare var Auth: AuthInterface
const SetAuthMiddleware = function (guardName: string, req: Request, res: Response, next: Function) {
  Auth.setDefaultGuard(guardName, req);
  next();
}

export default SetAuthMiddleware;