import BaseController from '@root/base/BaseController';
import express from 'express';

interface HomeControllerInterface extends BaseControllerInterface {
  index : Function
}

const HomeController : HomeControllerInterface = BaseController.extend(<HomeControllerInterface>{
  async index(req : express.Request, res : express.Response){
    res.send('Welcome to Mas Adapter service! '+global.node_identity);
  }
});

export default HomeController;