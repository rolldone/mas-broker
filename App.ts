import 'source-map-support/register'
require('module-alias/register')
const {multithread, runOnce} = require('node-multithread');
import BaseStart, { BaseStartInterface } from './base/BaseStart';
import bootstrap from './bootstrap';
import { Web, Api, Socket, Redis } from '@root/routes/v1/index';
import { AppConfig } from './config';
import SocketClient from './app/socketio/SocketClient';

interface AppInterface extends BaseStartInterface {
  /* Todo some extra types */
}
runOnce(() => {})
multithread(() => {
  BaseStart({
    port : null,
    init : [
      /* Your code Bootstrap here */
      bootstrap,
      /* Your can define your own stack bootstrap here */
      function(callback : Function){
        /* You can Define route here */
          Web.create(global.app);
          Api.create(global.app);
          Socket.create(global.app);
          Redis.create(global.app);
          callback(null);
      }],
    run : async function(){
      /* Server is ready! */
      /* You can create some programatic code here */
      /* Test nrp to socket */
      console.log('Done');
    }
  } as AppInterface);
},AppConfig.APP_THREAD_PROCESS);