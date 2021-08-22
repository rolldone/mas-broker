import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { ACCESS_NAME } from "../models/AdapterModel";
import Redis from 'redis';
import { RedisPubSub } from "@root/tool";
import SocketIO from 'socket.io';
import socketioClient from 'socket.io-client';
import { AppConfig } from "@root/config";
import * as upath from 'upath';

declare var masterData: MasterDataInterface

export interface TestToolServiceInterface extends BaseServiceInterface {
  _getSocketPath: { (adapter_key: string): string }
  startTestTool: { (props: any): void }
  startSocketIO: { (config: any): socketioClient.Socket }
  startRedisPubSub: { (config: any): RedisPubSubListener }
  returnIoSocket: { (): SocketIO.Socket }
  listenHitSubscriber: { (props: any): void }
}

export default BaseService.extend<TestToolServiceInterface>({
  /** Convert string to pathGroup */
  _getSocketPath: function (adapter_key) {
    if (adapter_key == null) {
      throw global.CustomError('error.missing.socket_io_base_path', 'Socket IO base path is null');
    }
    return upath.normalizeSafe('/' + AppConfig.BASE_SOCKET_IO_PATH + '/' + adapter_key);
  },
  startSocketIO: function (props) {
    try {
      let pathGroup = this._getSocketPath(props.adapter_key);
      console.log('pathGroup', pathGroup);
      console.log('ggggggggggg', props, AppConfig.APP_PROTOCOL + '://' + AppConfig.APP_DOMAIN);
      let socket = socketioClient.io(AppConfig.APP_PROTOCOL + '://' + AppConfig.APP_DOMAIN, {
        path: pathGroup,
        // transports: ['websocket', 'polling']
      })
      socket.on("connect_error", (err: any) => {
        // revert to classic upgrade
        console.log('vmdfkvm', err)
        // socket.io.opts.transports = ["polling", "websocket"];
      });
      return socket;
    } catch (ex) {
      throw ex;
    }
  },
  /* You are the broker */
  returnIoSocket: function () {
    return global.io;
  },
  startRedisPubSub: function (config: any) {
    const redisPub = Redis.createClient({
      port: config.port,
      host: config.host,
      // auth: Env.REDIS_AUTH,
      no_ready_check: config.no_ready_check,
      db: parseInt(config.db),
    });
    redisPub.on('error', function (err) {
      console.log('startRedisPubSub - redisPub - err', err)
    })
    redisPub.auth(config.password);
    const redisSub = Redis.createClient({
      port: config.port,
      host: config.host,
      // auth: Env.REDIS_AUTH,
      no_ready_check: config.no_ready_check,
      db: parseInt(config.db),
      // return_buffers: true
    });
    redisSub.on('error', function (err) {
      console.log('startRedisPubSub - redisSub - err', err)
    })
    redisSub.auth(config.password);
    let nrpConfig = {
      emitter: redisPub,
      receiver: redisSub,
      scope: config.scope
    };
    let nrp = RedisPubSub.create(nrpConfig);
    nrp.on("error", function (err: any) {
      console.log('startRedisPubSub - nrp - err', err)
    });
    return nrp;
  },
  startTestTool: function (props) {
    try {
      props.mode = 'TEST';
      let from_ad_event = props.from_ad_event;
      let adapter = from_ad_event.adapter;
      switch (adapter.access_name) {
        case ACCESS_NAME.REDIS:
          // console.log('props->', props);
          let nrp = this.startRedisPubSub(adapter.config);
          setTimeout(() => {
            nrp.emit(from_ad_event.event_key, props);
            // console.log('from -> ', from_ad_event.event_key, ' -> ', adapter.config);
            setTimeout(() => {
              nrp.quit();
              console.log('nrp from is quit!');
            }, 2000);
          }, 3000);
          break;
        case ACCESS_NAME.SOCKET_IO_SERVER:
          var fromSocketIOClient = this.startSocketIO({
            adapter_key: adapter.adapter_key,
          })
          fromSocketIOClient.emit(from_ad_event.event_key, props);
          console.log('from -> ', from_ad_event.event_key, ' -> ', adapter.config);
          setTimeout(() => {
            fromSocketIOClient.close();
            console.log('fromSocketIOClient from is quit!');
          }, 3000);
          break;
        case ACCESS_NAME.WEB_SOCKET_SERVER:
          break;
        case ACCESS_NAME.RABBITMQ:
          break;
        case ACCESS_NAME.MQTT:
          break;
      }

      let to_ad_event = props.to_ad_event;
      let to_adapter = to_ad_event.adapter;
      switch (to_adapter.access_name) {
        case ACCESS_NAME.REDIS:
          let toNrp = this.startRedisPubSub(to_adapter.config);
          let _disconectToNrp: any = toNrp.on(to_ad_event.event_key, function (err: any, props: any) {
            // console.log('to -> ', to_ad_event.event_key, ' -> ', props);
            _disconectToNrp();
            toNrp.quit();
            console.log('nrp to is quit!');
          })
          break;
        case ACCESS_NAME.SOCKET_IO_SERVER:
          var toSocketIOClient = this.startSocketIO({
            adapter_key: to_adapter.adapter_key,
          })
          toSocketIOClient.on(to_ad_event.event_key, function (props: any) {
            // console.log('to -> ', to_ad_event.event_key, ' -> ', props);
            console.log('toSocketIOClient to is quit!');
            toSocketIOClient.close();
          });
          break;
        case ACCESS_NAME.WEB_SOCKET_SERVER:
          break;
        case ACCESS_NAME.RABBITMQ:
          break;
        case ACCESS_NAME.MQTT:
          break;
      }
    } catch (ex) {
      throw ex;
    }
  },
  listenHitSubscriber: function (props) {
    try {
      if (typeof props.from !== 'object') {
        return;
      }
      if (props.from.mode == null) return;
      this.returnIoSocket().in(props.from.token).emit('test_tool.response', props);
    } catch (ex) {
      throw ex;
    }
  }
});