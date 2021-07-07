import express from 'express';
import BaseController from '../BaseController';

interface HomeControllerInterface extends BaseControllerInterface {
  index : Function
}

const HomeController : HomeControllerInterface = BaseController.extend(<HomeControllerInterface>{
  index(req : express.Request, res : express.Response){
    res.send({
      status : 'success',
      status_code : 200,
      return : 'Welcome to artywiz broadcast api service!'
    });
  }
});

export default HomeController;