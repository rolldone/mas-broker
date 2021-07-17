import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { RedisPubSub } from "@root/tool";
import Redis from 'redis';

export interface ConnectionServiceInterface extends BaseServiceInterface {
  connect?: { (props: any): Promise<any> }
  handleResponse: { (action: string, broker_key: string, err: any): void }
}

declare var masterData: MasterDataInterface;

export default BaseService.extend<ConnectionServiceInterface>({
  handleResponse: function (action, broker_key, err) {
    switch (action) {
      case 'REDIS_AUTH_ERROR':
        console.log('Redisclient - ConnectionService - handleResponse - ex ');
        console.log(' ', err);
        let redis_client = masterData.getData('adapter.collection.redis_client',{}) as any;
        if(redis_client[broker_key] == null){
          return;
        }
        delete redis_client[broker_key];
        masterData.saveData('adapter.collection.redis_client',redis_client);
        break;
    }
  },
  connect: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        broker_key: 'required',
        port: 'required',
        host: 'required',
        no_ready_check: 'required',
        db: 'required',
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', JSON.stringify(validation.errors.errors));
      }
      let config = props;
      const redisPub = Redis.createClient({
        port: config.port,
        host: config.host,
        // auth: Env.REDIS_AUTH,
        no_ready_check: config.no_ready_check || false,
        db: config.db,
      });
      redisPub.auth(config.password);
      redisPub.on('error', this.handleResponse.bind(this, 'REDIS_AUTH_ERROR', config.broker_key));
      const redisSub = Redis.createClient({
        port: config.port,
        host: config.host,
        // auth: Env.REDIS_AUTH,
        no_ready_check: config.no_ready_check || false,
        db: config.db,
        // return_buffers: true
      });
      redisSub.auth(config.password);
      redisSub.on('error', this.handleResponse.bind(this, 'REDIS_AUTH_ERROR', config.broker_key));
      let nrpConfig = {
        emitter: redisPub,
        receiver: redisSub,
        scope: config.scope
      };
      let nrp = RedisPubSub(nrpConfig);
      let redis_client = masterData.getData('adapter.collection.redis_client', {}) as any;
      if (redis_client[config.broker_key] != null) {
        throw global.CustomError('error.adapter_exist', 'Adapter is exist');
      }
      redis_client[config.broker_key] = <RedisPubSubListener>{
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
      /* Save the redis connection */
      masterData.saveData('adapter.collection.redis_client', redis_client);
      /* Go to create redis event listener */
      masterData.saveData('adapter.connection.redis.event.start_all',props.broker_events);
    } catch (ex) {
      throw ex;
    }
  }
});