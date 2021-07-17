import SocketClient, { SocketClientInterface } from "@root/app/socketio/SocketClient";
import BaseController from "../BaseController";

interface MockupListenerInterface extends BaseControllerInterface{
  redisListenMockups : {(err: object,props : {
    from : String,
    to : String,
    return : Object
  }) : Promise<any> | void}
  returnSocketClient : {() : SocketClientInterface }
  returnIoSocket : {():any}
  sock : SocketClientInterface | null
}

const MockupListenerController = BaseController.extend<MockupListenerInterface>({
  /* As client use publish.main.way for emit */
  returnSocketClient : function(){
    return SocketClient.create();
  },
  /* You are the adapter */
  returnIoSocket : function(){
    return global.io;
  },
  sock : null,
  redisListenMockups :  function(err : any,props : any){
    let self = this;
    setTimeout(function(props : any){
      console.log('redisListenSelfMockups -> ',props.to,' - ',props.return.id);
      self.returnIoSocket().in(props.to).emit(props.key,props.return);
    }.bind(null,props),100);
  }
});

export default MockupListenerController;