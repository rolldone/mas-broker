import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";

export interface EventServiceInterface extends BaseServiceInterface {
  handleSubscribeEvent?: { (event_key: string, err: any, props: any): void }
  add?: { (props: any): void }
  delete?: { (props: any): void }
  get?: { (props: any): void }
}

declare var masterData: MasterDataInterface;

export default BaseService.extend<EventServiceInterface>({
  handleSubscribeEvent: function (event_key, err, props) {
    console.log('event_key', event_key);
    if (err != null) {
      console.log('RedisClient - EventService - handleSubscribeEvent - ex => ')
      console.log(' ', err);
      return;
    }
    console.log('RedisClient - EventService - handleSubscribeEvent => ')
    console.log(' ', props);
    /* Logic gateway at here */
  },
  add: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        adapter: 'required'
      })
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', JSON.stringify(validation.errors.errors));
      }
      let adapter = props.adapter;
      let redis_client = masterData.getData('adapter.collection.redis_client', {}) as any;
      if (redis_client[adapter.adapter_key] == null) {
        throw global.CustomError('error.not_found', 'Adapter key ' + adapter.adapter_key + ' is not found check on your database!');
      }
      if (redis_client[adapter.adapter_key]['event_key'] == null) {
        redis_client[adapter.adapter_key]['event_key'] = {};
      }
      if (redis_client[adapter.adapter_key]['event_key_function'] == null) {
        redis_client[adapter.adapter_key]['event_key_function'] = {};
      }
      let eventListener = this.handleSubscribeEvent.bind(this, props.event_key);
      redis_client[adapter.adapter_key]['event_key'][props.event_key] = redis_client[adapter.adapter_key].on(props.event_key, eventListener);
      redis_client[adapter.adapter_key]['event_key_function'][props.event_key] = eventListener;
      masterData.saveData('adapter.collection.redis_client', redis_client);
      setTimeout(()=>{
        redis_client[adapter.adapter_key].emit(props.event_key,'Test pubsub');
      },2000);
    } catch (ex) {
      throw ex;
    }
  },
  delete: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        adapter: 'required'
      })
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', JSON.stringify(validation.errors.errors));
      }
      let adapter = props.adapter;
      let redis_client = masterData.getData('adapter.collection.redis_client', {}) as any;
      if (redis_client[adapter.adapter_key] == null) {
        throw global.CustomError('error.not_found', 'Adapter key ' + adapter.adapter_key + ' is not found check on your database!');
      }
      if (redis_client[adapter.adapter_key]['event_key'][props.event_key] == null) {
        throw global.CustomError('error.not_found', 'Adapter event_key ' + props.event_key + ' is not found on adapter key ' + adapter.adapter_key);
      }
      /* Unsubscribe the event redis pub sub */
      redis_client[adapter.adapter_key]['event_key'][props.event_key](redis_client[adapter.adapter_key]['event_key_function'][props.event_key]);
      delete redis_client[adapter.adapter_key]['event_key'][props.event_key];
      masterData.saveData('adapter.collection.redis_client', redis_client);
    } catch (ex) {
      throw ex;
    }
  },
  get: function (props) {

  }
});