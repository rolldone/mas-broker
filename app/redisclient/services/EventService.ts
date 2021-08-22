import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { Adapter, AdapterEvent } from "@root/sequelize/models";
import DataManipulation from "../compute/DataManipulation";
import GatewayModel, { GatewayModelInterface, GATEWAY_STATUS } from "../models/GatewayModel";

export interface EventServiceInterface extends BaseServiceInterface {
  returnGatewayModel?: { (): GatewayModelInterface }
  getGateways?: { (receiver_id: number, props: any): Promise<any> }
  handleSubscribeEvent?: { (adapter_event: any, err: any, props: any): void }
  add?: { (props: any): void }
  delete?: { (props: any): void }
  get?: { (props: any): void }
  emit?: { (props: any, callback?: Function): void }
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
          receiver_id: receiver_id,
          status: GATEWAY_STATUS.ON
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
      // console.log('resGatewayDatas -> ')
      // console.log(resGatewayDatas);
      let middlewareReceivers = masterData.getData('gateway.middleware.receivers', {}) as any;
      for (var a = 0; a < resGatewayDatas.length; a++) {
        let dataManipulation = DataManipulation.create();
        dataManipulation.recursiveFunction(0, function (props: any) {
          masterData.saveData('adapter.connection.' + resGatewayDatas[a].sender.adapter.access_name.toLowerCase() + '.event.emit', props);
        }, ((passMidString: Array<string>) => {
          let tt = [];
          for (var b = 0; b < passMidString.length; b++) {
            tt.push(middlewareReceivers[resGatewayDatas[a].receiver.adapter.access_name][passMidString[b]]);
          }
          return tt;
        })(resGatewayDatas[a].middleware_receiver as Array<string> || []), {
          gateway: resGatewayDatas[a],
          value: props
        })
      }
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
    
    /* Test tool */
    masterData.saveData('adapter.test_tool.listen', {
      event_key : adapter_event.event_key,
      adapter_event : adapter_event,
      from : props
    });

    this.getGateways(adapter_event.id, props);
    // console.log('RedisClient - EventService - handleSubscribeEvent => ')
    console.log(' ', adapter_event.event_key, ' -> ', props);
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

  },
  emit: function (props, callback = null) {
    let value = props.value;
    let gateway = props.gateway;

    // console.log('emit props -> ')
    // console.log(props);
    let middlewareSenders = masterData.getData('gateway.middleware.senders', {}) as any;
    let dataManipulation = DataManipulation.create();
    dataManipulation.recursiveFunction(0, function (props: any) {
      /* Is it happen when middleware set done(null) */
      if (props == null) {
        return;
      }
      if (callback != null) {
        return callback(props);
      }
      /* Initialize again */
      let value = props.value;
      let gateway = props.gateway;
      /* Try to get redis_client connection */
      let sender = gateway.sender;
      let sender_adapter = sender.adapter;
      let redis_client = masterData.getData('adapter.collection.redis_client', {}) as any;
      if (redis_client[sender_adapter.adapter_key] == null) {
        return;
      }
      /* Emit the data */
      redis_client[sender_adapter.adapter_key].emit(sender.event_key, value);

    }, ((passMidString: Array<string>) => {
      let tt = [];
      for (var b = 0; b < passMidString.length; b++) {
        tt.push(middlewareSenders[gateway.sender.adapter.access_name][passMidString[b]]);
      }
      return tt;
    })(gateway.middleware_sender as Array<string> || []), {
      gateway: gateway,
      value: value
    })
  }
});