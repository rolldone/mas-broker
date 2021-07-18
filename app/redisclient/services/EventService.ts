import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { AdapterEvent } from "@root/models";
import GatewayModel, { GatewayModelInterface } from "../models/GatewayModel";
import Adapter from "../sequelize/Adapter";

export interface EventServiceInterface extends BaseServiceInterface {
  returnGatewayModel?: { (): GatewayModelInterface }
  getGateways?: { (receiver_id: number, props: any): Promise<any> }
  handleSubscribeEvent?: { (adapter_event: any, err: any, props: any): void }
  add?: { (props: any): void }
  delete?: { (props: any): void }
  get?: { (props: any): void }
}

declare var masterData: MasterDataInterface;

export default BaseService.extend<EventServiceInterface>({
  returnGatewayModel: function () {
    return GatewayModel.create();
  },
  getGateways: async function (receiver_id, props) {
    try {
      let gatewayModel = this.returnGatewayModel();
      let resGatewayDatas = await gatewayModel.get({
        where: {
          receiver_id: receiver_id
        },
        include: [{
          model: AdapterEvent,
          as: 'sender',
          include: [{
            model: Adapter,
            as: 'adapter'
          }]
        }, {
          model: AdapterEvent,
          as: 'receiver',
          include: [{
            model: Adapter,
            as: 'adapter'
          }]
        }]
      });
      resGatewayDatas = gatewayModel.getJSON(resGatewayDatas) as Array<any>;
      // console.log('resGatewayDatas -> ', resGatewayDatas);
      for (var a = 0; a < resGatewayDatas.length; a++) {
        masterData.saveData('adapter.connection.' + resGatewayDatas[a].sender.adapter.access_name.toLowerCase() + '.event.emit', {
          gateway: resGatewayDatas[a],
          value: props
        });
      }
      // let eventModel = this.returnEventModel();
      // let resEventDatas = eventModel.
    } catch (ex) {
      throw ex;
    }
  },
  handleSubscribeEvent: function (adapter_event, err, props) {
    console.log('event_key', adapter_event.event_key);
    if (err != null) {
      console.log('RedisClient - EventService - handleSubscribeEvent - ex => ')
      console.log(' ', err);
      return;
    }
    this.getGateways(adapter_event.id, props);
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
      let eventListener = this.handleSubscribeEvent.bind(this, props);
      redis_client[adapter.adapter_key]['event_key'][props.event_key] = redis_client[adapter.adapter_key].on(props.event_key, eventListener);
      redis_client[adapter.adapter_key]['event_key_function'][props.event_key] = eventListener;
      masterData.saveData('adapter.collection.redis_client', redis_client);
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