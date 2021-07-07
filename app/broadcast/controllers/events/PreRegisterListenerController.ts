import SocketClient, { SocketClientInterface } from "@root/app/socketio/SocketClient";
import BaseController from "../BaseController";

interface PreRegisterListenerInterface extends BaseControllerInterface {
  redisListenPreRegisterInsert: {
    (err: object, props: {
      from: String,
      to: String,
      return: Object
    }): Promise<any> | void
  }
  returnSocketClient: { (): SocketClientInterface }
  returnIoSocket: { (): any }
  sock: SocketClientInterface | null
}

const PreRegisterListenerController = BaseController.extend<PreRegisterListenerInterface>({
  /* As client use publish.main.way for emit */
  returnSocketClient: function () {
    return SocketClient.create();
  },
  /* You are the broker */
  returnIoSocket: function () {
    return global.io;
  },
  sock: null,
  redisListenPreRegisterInsert: function (err: any, props: any) {
    let self = this;
    setTimeout(function (props: any) {
      console.log('redisListenSelfMockups -> ', props.to, ' - ', props);
      self.returnIoSocket().in(props.to).emit(props.key, props.return);
    }.bind(null, props), 100);
  }
});

export default PreRegisterListenerController;