import MainHomeController, { HomeControllerInterface } from "@root/app/main/controllers/xhr/HomeController";
import ws from 'ws';
const WebSocketWrapper = require('ws-wrapper');

const HomeController = MainHomeController.extend<HomeControllerInterface>({
  index: function (req, res) {
    let action = req.query.action || 'terima';
    const client = new WebSocketWrapper(new ws("ws://masbroker.lan/socket/9d8b8cdd937a943a2aec11549f68adc4?id=2", {}));
    client.of('foo').on('test', function(props:any){
      console.log('test -> ',props);
    });
    
    client.on('open', function(){
      if(action == 'terima'){
        client.on('test', function(props:any){
          console.log('test tanpa of -> ',props);
        });
      }
      setTimeout(()=>{
        client.emit('join',{
          channel : 'foo',
          token : 'vmadkfvmakdfvmkfdvmkfv'
        });
      },1000);
      var test = ()=>{
        setTimeout(function(){
          console.log('vmfdkvmfdv');
          
          // const array = new Float32Array(5);
    
          //   for (var i = 0; i < array.length; ++i) {
          //     array[i] = i / 2;
          //   }
    
          //   client.send(array);
          client.emit('test',{
            from : 'Donny',
            payload : 'vmdfkvmdkfvmkvm'
          });
          test();
        },5000);
      }
      if(action == 'kirim'){
        test();
      }
    });
    // client.on('ping', heartbeat);
    
    client.on('close', function clear() {
      
    });
    res.send({
      status: 'success',
      status_code: 200,
      return: 'Welcome to Mas Broker api service with test socketcluster!'
    });
  }
});

export default HomeController;