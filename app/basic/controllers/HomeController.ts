import express from 'express';
import BaseController from './BaseController';

interface HomeControllerInterface extends BaseControllerInterface {
  index : Function
}

const HomeController : HomeControllerInterface = BaseController.extend(<HomeControllerInterface>{
  async index(req : express.Request, res : express.Response){
    res.send('Welcome to artywiz broadcast service! '+global.node_identity);
  }
});

export default HomeController;