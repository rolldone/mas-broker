import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { ACCESS_NAME } from "../models/AdapterModel";
import Redis from 'redis';
import { RedisPubSub } from "@root/tool";

declare var masterData: MasterDataInterface

export interface TestToolServiceInterface extends BaseServiceInterface {
  startTestTool: { (props: any): void }
  startRedisPubSub: { (config: any): RedisPubSubListener }
}

export default BaseService.extend<TestToolServiceInterface>({
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
    let nrp = RedisPubSub(nrpConfig);
    nrp.on("error", function (err: any) {
      console.log('startRedisPubSub - nrp - err', err)
    });
    let res_nrp = <RedisPubSubListener>{
      emit: function (whatKey: string, whatObject: any) {
        if (whatObject instanceof Error) {
          whatObject = global.serializeError(whatObject);
        }
        return nrp.emit(whatKey, whatObject);
      },
      on: function (whatKey: string, callback: Function) {
        let unsubscribe = nrp.on(whatKey, function (props: any) {
          let testError = global.deserializeError(props.toString());
          if (testError.toString().indexOf('NonError:', 0) == 0) {
            callback(null, props);
            return;
          }
          callback(testError, null);
        });
        return unsubscribe;
      }
    }
    return res_nrp;
  },
  startTestTool: function (props) {
    try {
      let from_ad_event = props.from_ad_event;
      let adapter = from_ad_event.adapter;
      let to_ad_event = props.to_ad_event;
      switch (adapter.access_name) {
        case ACCESS_NAME.REDIS:
          // console.log('props->', props);
          let nrp = this.startRedisPubSub(adapter.config);
          nrp.on(to_ad_event.event_key, function (err: any, props: any) {
            console.log('aaaaaaaaa -> ', props);
          })
          setTimeout(() => {
            nrp.emit(from_ad_event.event_key, props);
            console.log('from_ad_event.event_key', adapter.config);
          }, 3000);
          break;
        case ACCESS_NAME.SOCKET_IO_SERVER:
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
  }
});