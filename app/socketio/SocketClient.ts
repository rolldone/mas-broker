import BaseProto from '@root/base/BaseProto';
import { AppConfig } from '@root/config';
import debounce from 'lodash/debounce';

export interface SocketClientInterface extends BaseProtoInterface<SocketClientInterface>{
  call : {(token : String) : Promise<SocketClientInterface> }
  PREFIX : string
  is_connected : boolean
  socket : any
  disconnect : Function
  sendMessage : { (event : string, props : object ) : void }
  join : {(token : String) : void}
  connect : Function
}

const SocketClient : SocketClientInterface = BaseProto.extend<SocketClientInterface>({
  PREFIX : 'SYSTEM_',
  is_connected : false,
  socket : require('socket.io-client')(AppConfig.SOCKET_DOMAIN, {
    path: '/socket',
    transports : ['websocket'],
    query : {
      'prefix' : 'SYSTEM_'
    }
  }),
  call : function(token) {
    let self = this;
    return new Promise(function(resolve) {
      self.socket.on('disconnect', function() {
        console.log('user-system', 'disconnect');
      });
      self.socket.on('connect_error', function() {
        console.log('connect_error')
      });
      self.socket.on('connect', function() {
        console.log('socket-client -> ',token);
        self.is_connected = true;
        self.join(token);
        resolve(self);
      });
      self.connect();
    })
  },
  disconnect: function() {
    let self = this;
    self.socket.close();
  },
  sendMessage : function(event, props) {
    let self = this;
    return new Promise(function(resolve) {
      self.socket.emit(event, props);
      resolve(true);
    })
  },
  join : function(token) {
    let self = this;
    console.log('socket client join to -> ','gate -> ',token);
    self.socket.emit('gate', token);
  },
  connect : function() {
    let self = this;
    self.socket.connect();
  }
});

export default SocketClient;