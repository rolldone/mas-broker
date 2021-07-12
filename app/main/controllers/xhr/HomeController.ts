import BaseController from '@root/base/BaseController';
import express from 'express';

export interface HomeControllerInterface extends BaseControllerInterface {
  index ?: {(req : express.Request, res : express.Response):void}
}

const HomeController : HomeControllerInterface = BaseController.extend(<HomeControllerInterface>{
  index(req,res){
    res.send({
      status : 'success',
      status_code : 200,
      return : 'Welcome to Mas Broker api service!'
    });
  }
});

export default HomeController;