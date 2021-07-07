import SocketClient, { SocketClientInterface } from "@root/app/socketio/SocketClient";
import BaseQueue from "@root/base/BaseQueue";

interface SendToClientQueueInterface extends BaseQueueInterface{
  returnSocketClient : { (channel : String) : Promise<SocketClientInterface> }
}

const SendToClientQueue : SendToClientQueueInterface = BaseQueue.extend(<SendToClientQueueInterface>{
  queue_name : 'SEND_CLIENT_QUEUE_',
  returnSocketClient : async function(channel){
    return await SocketClient.call(channel);
  },
  process(props,done){
    try{
      
    }catch(ex){
      done(true);
    }
  }
});

export default SendToClientQueue;