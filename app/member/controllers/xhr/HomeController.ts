import MainHomeController, { HomeControllerInterface } from "@root/app/main/controllers/xhr/HomeController";
import ws from 'ws';
const WebSocketWrapper = require('ws-wrapper');

const HomeController = MainHomeController.extend<HomeControllerInterface>({
  index: function (req, res) {
    let action = req.query.action || 'terima';
    const client = new WebSocketWrapper(new ws("ws://masadapter.lan/socket/dd6e20928f15e3b43ebc7022549870e3", {}));
    
    client.on('open', function(){
      if(action == 'terima'){
        client.on('first.channel', function(props:any){
          console.log('test tanpa of -> ',props);
        });
        client.of('foo').on('first.channel', function(props:any){
          console.log('test -> ',props);
        });
      }
      setTimeout(()=>{
        client.emit('join',{
          channel : 'foo',
          token : 'vmadkfvmakdfvmkfdvmkfv'
        });
      },1000);
      var test = ()=>{
        console.log('avvvvvvvvvvvvvvvvv');
        setTimeout(function(){
          
          // const array = new Float32Array(5);
    
          //   for (var i = 0; i < array.length; ++i) {
          //     array[i] = i / 2;
          //   }
    
          //   client.send(array);
          client.of('foo').emit('first.channel',{
            name : "Donny rolanda",
            email : 'donny.rolanda@gmail.com'
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
      return: 'Welcome to Mas Adapter api service with test socketclusterrr!'
    });
  }
});

export default HomeController;