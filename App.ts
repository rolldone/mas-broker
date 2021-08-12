import 'source-map-support/register'
require('module-alias/register')
const { multithread, runOnce } = require('node-multithread');
import BaseStart, { BaseStartInterface } from './base/BaseStart';
import bootstrap from './bootstrap';
import { Web, Api, Socket, Redis, EventEmit } from '@root/routes/v1/index';
import { AppConfig } from './config';
import { MasterDataInterface } from './bootstrap/StartMasterData';
import middleware from './app/middleware';
import SequelizeInitModel from '@root/sequelize/models';
declare var masterData: MasterDataInterface

interface AppInterface extends BaseStartInterface {
  /* Todo some extra types */
}
runOnce(() => { })
multithread(() => {
  BaseStart({
    port: null,
    init: [
      /* Running sequelize initialize first */
      function (callback: Function) {
        SequelizeInitModel(callback);
      },
      /* Your code Bootstrap here */
      bootstrap,
      /* Your can define your own stack bootstrap here */
      function (callback: Function) {
        /* You can Define route here */
        EventEmit.create(global.app);
        Web.create(global.app);
        Api.create(global.app);
        // Socket.create(global.app);
        // Redis.create(global.app);
        callback(null);
      },
      middleware],
    run: async function () {
      /* Server is ready! */
      /* You can create some programatic code here */
      /* Test nrp to socket */

      /* Load gate for client connect*/
      // masterData.saveData('websocket.group.start_groups',{});
      /* Load adapter connect to outside adapter service*/
      masterData.saveData('adapter.start_all', {});
      console.log('Done');
    }
  } as AppInterface);
}, AppConfig.APP_THREAD_PROCESS);