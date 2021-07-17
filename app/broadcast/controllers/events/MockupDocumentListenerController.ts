import SocketClient, { SocketClientInterface } from "@root/app/socketio/SocketClient";
import BaseController from "../BaseController";

interface MockupDocumentListenerInterface extends BaseControllerInterface {
  redisListenSelfMockupsDocuments: {
    (err: any, props: {
      from: String,
      to: String,
      return: Object
    }): void
  }
  redisListenOtherMockupsDocuments: {
    (err: any, props: {
      from: String,
      to: String,
      return: Object
    }): void
  }
  redisListenSelfMockupSponsors: {
    (err: any, props: {
      from: String,
      to: String,
      return: Object
    }): void
  }
  returnSocketClient: { (): SocketClientInterface }
  returnIoSocket: { (): any }
  sock: SocketClientInterface | null
}

const MockupDocumentListenerController = BaseController.extend<MockupDocumentListenerInterface>({
  /* As client use publish.main.way for emit */
  returnSocketClient: function () {
    return SocketClient.create();
  },
  /* You are the adapter */
  returnIoSocket: function () {
    return global.io;
  },
  sock: null,
  redisListenSelfMockupsDocuments: function (err: any, props: any) {
    let self = this;
    setTimeout(function (props: any) {
      console.log('redisListenSelfMockupsDocuments -> ', props.to, ' - ', props.key, ' - ', props.return.id);
      self.returnIoSocket().in(props.to).emit(props.key, props.return);
    }.bind(null, props), 100);
  },
  redisListenOtherMockupsDocuments: function (err: any, props: any) {
    let self = this;
    setTimeout(function (props: any) {
      console.log('redisListenOtherMockupsDocuments -> ', props.to, ' - ', props.key, ' - ', props.return.id);
      self.returnIoSocket().in(props.to).emit(props.key, props.return);
    }.bind(null, props), 100);
  },
  redisListenSelfMockupSponsors: function (err: any, props: any) {
    let self = this;
    console.log('redisListenSelfMockupSponsors -> ', props.to);
    setTimeout(function (props: any) {
      self.returnIoSocket().in(props.to).emit(props.key, props.return);
    }.bind(null, props), 100);
  }
});

export default MockupDocumentListenerController;