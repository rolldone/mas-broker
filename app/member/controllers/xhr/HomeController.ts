import MainHomeController, { HomeControllerInterface } from "@root/app/main/controllers/xhr/HomeController";
const socketCluster  = require('socketcluster-client');

const HomeController = MainHomeController.extend<HomeControllerInterface>({
  index:function(req,res){
    let pathGroup = '/socket/'+req.query.path;
    if(req.query.path == null){
      pathGroup = '/test';
    }
    var socket = socketCluster.connect({
      hostname : 'masbroker.lan',
      port : 80,
      path : pathGroup
    });
    socket.onopen = function(){
      console.log('engine.io connect');
      socket.onmessage = function(data:any){

      };
      socket.onclose = function(){};
    };
    res.send({
      status : 'success',
      status_code : 200,
      return : 'Welcome to Mas Broker api service with test socketcluster to '+pathGroup+'!'
    });
  }
});

export default HomeController;