import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { RedisPubSub } from "@root/tool";
import Redis from 'redis';

export interface ConnectionServiceInterface extends BaseServiceInterface {
  connect?: { (props: any): Promise<any> }
  disconect?: { (props: any): Promise<any> }
  handleResponse: { (action: string, adapter_key: string, err: any): void }
}

declare var masterData: MasterDataInterface;

export default BaseService.extend<ConnectionServiceInterface>({
  handleResponse: function (action, adapter_key, err) {
    switch (action) {
      case 'REDIS_AUTH_ERROR':
        console.log('Redisclient - ConnectionService - handleResponse - ex ');
        console.log(' ', err);
        var redis_client = masterData.getData('adapter.collection.redis_client', {}) as any;
        if (redis_client[adapter_key] == null) {
          return;
        }
        // delete redis_client[adapter_key];
        masterData.saveData('adapter.collection.redis_client', redis_client);
        break;
      case 'REDIS_NRP_ERROR':
        console.log('Redisclient - ConnectionService - NRP - handleResponse - ex ');
        console.log(' ', err);
        var redis_client = masterData.getData('adapter.collection.redis_client', {}) as any;
        if (redis_client[adapter_key] == null) {
          return;
        }
        // delete redis_client[adapter_key];
        masterData.saveData('adapter.collection.redis_client', redis_client);
        break;
    }
  },
  connect: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        adapter_key: 'required',
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
        db: parseInt(config.db),
      });
      redisPub.auth(config.password);
      redisPub.on('error', this.handleResponse.bind(this, 'REDIS_AUTH_ERROR', config.adapter_key));
      const redisSub = Redis.createClient({
        port: config.port,
        host: config.host,
        // auth: Env.REDIS_AUTH,
        no_ready_check: config.no_ready_check || false,
        db: parseInt(config.db),
        // return_buffers: true
      });
      redisSub.auth(config.password);
      redisSub.on('error', this.handleResponse.bind(this, 'REDIS_AUTH_ERROR', config.adapter_key));
      let nrpConfig = {
        emitter: redisPub,
        receiver: redisSub,
        scope: config.scope
      };
      let nrp = RedisPubSub.create(nrpConfig);
      nrp.on("error", this.handleResponse.bind(this, 'REDIS_NRP_ERROR', config.adapter_key));
      let redis_client = masterData.getData('adapter.collection.redis_client', {}) as any;
      if (redis_client[config.adapter_key] != null) {
        throw global.CustomError('error.adapter_exist', 'Adapter is exist');
      }
      redis_client[config.adapter_key] = <RedisPubSubListener>{
        emit: function (whatKey: string, whatObject: any) {
          if (whatObject instanceof Error) {
            whatObject = global.serializeError(whatObject);
          }
          return nrp.emit(whatKey, whatObject);
        },
        on: function (whatKey: string, callback: Function) {
          let unsubscribe = nrp.on(whatKey, function (err: any, props: any) {
            // console.log('propssssss', props);
            let testError = global.deserializeError(props.toString());
            if (testError.toString().indexOf('NonError:', 0) == 0) {
              callback(null, props);
              return;
            }
            callback(testError, null);
          });
          return unsubscribe;
        },
        end: function () {
          nrp.end();
        },
        quit: function () {
          nrp.quit();
        }
      }
      /* Save the redis connection */
      masterData.saveData('adapter.collection.redis_client', redis_client);
      /* Go to create redis event listener */
      if (props.adapter_events != null) {
        masterData.saveData('adapter.connection.redis.event.start_all', props.adapter_events);
      }
      /* Test the redisPubsub first maybe. Remember setTimeout*/

      // redis_client[config.adapter_key].on('first.event', function (err: any, props: any) {
      //   console.log('force-check-err', err);
      //   console.log('force-check-props', props);
      // })
      // setTimeout(function () {
      //   try {
      //     redis_client[config.adapter_key].emit('first.event', {
      //       "from": "test",
      //       "value": "vmdfkvmkfdvm"
      //     })
      //   } catch (ex) {
      //     console.log('Redis - first.channel - emit - ex ', ex);
      //   }
      // }, 20000);
    } catch (ex) {
      throw ex;
    }
  },
  disconect: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        adapter_key: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', JSON.stringify(validation.errors.errors));
      }
      let config = props;
      let redis_client = masterData.getData('adapter.collection.redis_client', {}) as any;
      if (redis_client[config.adapter_key] == null) {
        throw global.CustomError('error.adapter_exist', 'Adapter is not exist');
      }
      redis_client[config.adapter_key].end();
      delete redis_client[config.adapter_key];
      masterData.saveData('adapter.collection.redis_client', redis_client);
    } catch (ex) {
      throw ex;
    }
  }
});