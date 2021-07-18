import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { AdapterEvent } from "@root/models";
import { ADAPTER_EVENT_STATUS } from "../models/AdapterEventModel";
import GatewayModel, { GatewayModelInterface } from "../models/GatewayModel";
import { GROUP_STATUS } from "../models/GroupModel";
import ConnectionService, { ConnectionServiceInterface } from "./ConnectionService";
const WebSocketWrapper = require('ws-wrapper');

declare var masterData: MasterDataInterface

export interface EventServiceInterface extends Omit<ConnectionServiceInterface, 'create'> {
  create?: (...props: any) => this
  returnGatewayModel?: { (): GatewayModelInterface }
  getGateways?: { (sender_id: number, props: any): Promise<any> }
  generateSocketEvent?: { (props: any): void }
  deleteSocketEvent?: { (props: any): void }
  startSocketEvents?: { (ws: any, events?: Array<any>): void }
  stopSocketEvent?: { (props: any): void }
  startSocketEvent?: { (props: any): void }
  logSocketEvent?: { (props: any): void }
  logSocketEvents?: { (props: any): void }
  emit: { (props: any): void }
}

export default ConnectionService.extend<EventServiceInterface>({
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
          as: 'sender'
        }, {
          model: AdapterEvent,
          as: 'receiver'
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
    } catch (ex) {
      throw ex;
    }
  },
  generateSocketEvent: async function (props) {
    try {
      if (props.status == ADAPTER_EVENT_STATUS.OFF) {
        return;
      }
      let validation = this.returnValidator(props, {
        adapter_id: 'required',
        status: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }

      let adapterModel = this.returnAdapterModel();
      let resDataGroupModel = await adapterModel.first({
        where: {
          id: props.adapter_id,
          status: GROUP_STATUS.ON
        }
      })
      let pathGroup = this._getSocketPath(resDataGroupModel.adapter_key);
      let wsCollections: {
        [key: string]: any
      } = masterData.getData('ws.collections', {}) as any;
      if (wsCollections[pathGroup] == null) {
        throw global.CustomError('error.not_found', 'The ws with inside adapter_key ' + resDataGroupModel.adapter_key + ' is not found!');
      }
      if (wsCollections[pathGroup].wsFuncs == null) {
        wsCollections[pathGroup].wsFuncs = {} as any;
      }
      if (wsCollections[pathGroup].wsFuncs[props.event_key] == null) {
        wsCollections[pathGroup].wsFuncs[props.event_key] = function (event_key: string, props: any) {
          console.log('wsCollections function -> ', event_key, props);
        }
      }
      // wsCollections[pathGroup].removeEventListener(props.event_key, wsCollections[pathGroup].wsFuncs[props.event_key].bind(this, props.event_key));
      wsCollections[pathGroup].on(props.event_key, wsCollections[pathGroup].wsFuncs[props.event_key].bind(this, props.event_key));
      wsCollections[pathGroup].on('test', function (props: any) {
        console.log('test from server -> ', props);
      })
    } catch (ex) {
      throw ex;
    }
  },
  deleteSocketEvent: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        id: 'required',
        adapter_id: 'required',
        user_id: 'required',
        status: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      if (props.status == ADAPTER_EVENT_STATUS.OFF) {
        return;
      }
      let adapterModel = this.returnAdapterModel();
      let resDataGroupModel = await adapterModel.first({
        where: {
          id: props.adapter_id,
          user_id: props.user_id,
          status: props.status
        },
      })
      resDataGroupModel = adapterModel.getJSON(resDataGroupModel);
      props.adapter = resDataGroupModel;
      let events = [props];
      for (var a = 0; a < events.length; a++) {
        let adapter = events[a].adapter;
        let pathGroup = this._getSocketPath(adapter.adapter_key);
        let socketCollections: { [key: string]: any } = masterData.getData('socket.clients', {}) as any;
        if (socketCollections[pathGroup] == null) {
          throw global.CustomError('error.ws.not_found', 'The socket with adapter_key ' + adapter.adapter_key + ' is not found!');
        }
        for (var key in socketCollections[pathGroup]) {
          /** Basic ws remove listener */
          // wsCollections[pathGroup].removeEventListener('message', wsCollections[pathGroup].wsFuncs[events[a].event_key].bind(this, events[a].event_key));
          /** Modern ws with websocket wrapper method listener */
          socketCollections[pathGroup][key].removeListener(events[a].event_key, socketCollections[pathGroup][key].wsFuncs[events[a].event_key].bind(this, socketCollections[pathGroup][key], events[a].event_key));
          /* With channel */
          if (socketCollections[pathGroup + '_of'][key] != null) {
            socketCollections[pathGroup + '_of'][key].removeListener(events[a].event_key, socketCollections[pathGroup + '_of'][key].wsFuncs[events[a].event_key].bind(this, socketCollections[pathGroup + '_of'][key], events[a].event_key));
          }
        }
      }
    } catch (ex) {
      throw ex;
    }
  },
  stopSocketEvent: function (props) {
    return this.deleteSocketEvent(props);
  },
  startSocketEvent: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        id: 'required',
        adapter_id: 'required',
        user_id: 'required',
        status: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      if (props.status == ADAPTER_EVENT_STATUS.OFF) {
        return;
      }
      let adapterModel = this.returnAdapterModel();
      let resAdapterModel = await adapterModel.first({
        where: {
          id: props.adapter_id,
          user_id: props.user_id,
          status: props.status
        },
      })
      resAdapterModel = adapterModel.getJSON(resAdapterModel);
      props.adapter = resAdapterModel;

      /* Get all client socket */
      let socketClients: { [key: string]: any } = masterData.getData('socket.clients', {}) as any;
      let pathGroup = this._getSocketPath(props.adapter.adapter_key);
      if (socketClients[pathGroup] == null) {
        throw global.CustomError('error.ws.not_found', 'The socket with adapter_key ' + props.adapter.adapter_key + ' is not found!');
      }
      for (var key in socketClients[pathGroup]) {
        this.startSocketEvents(socketClients[pathGroup][key], [props]);
      }
    } catch (ex) {
      throw ex;
    }
  },
  startSocketEvents: async function (ws, events = []) {
    try {
      if (events.length == 0) {
        return;
      }
      for (var a = 0; a < events.length; a++) {
        let adapter = events[a].adapter;
        let pathGroup = this._getSocketPath(adapter.adapter_key);

        if (ws.wsFuncs == null) {
          ws.wsFuncs = {} as any;
        }

        if (ws.wsFuncs[events[a].event_key] == null) {
          ws.wsFuncs[events[a].event_key] = function (pathGroup: string, news_of: any, adapter_event: any, ...props: any) {
            /* You can log this area */
            // news_of.emit(event_key,'test');
            // console.log('news_of',news_of.name);
            // console.log('propsssssssssssssssssss', props);
            this.getGateways(adapter_event.id, {
              to : news_of.name,
              payload : props
            });
          }
        }


        /** Basic ws remove listener */
        ws.removeListener(events[a].event_key, ws.wsFuncs[events[a].event_key].bind(this, pathGroup, ws, events[a]))
        /** Basic ws method */
        ws.on(events[a].event_key, ws.wsFuncs[events[a].event_key].bind(this, pathGroup, ws, events[a]));
      }
    } catch (ex) {
      throw ex;
    }
  },
  logSocketEvent: function (props) {

  },
  logSocketEvents: function (props) {

  },
  emit: async function (props) {
    let socketCollections: { [key: string]: any } = masterData.getData('socket.clients', {}) as any;
    let value = props.value;
    let gateway = props.gateway;
    let sender = gateway.sender;
    let sender_adapter = sender.adapter;
    let pathGroup = this._getSocketPath(sender_adapter.adapter_key);
    if (socketCollections[pathGroup] == null) {
      return;
    }
    let prepareToEmit = {} as any;
    for (var key in socketCollections[pathGroup]) {
      let theSocket = socketCollections[pathGroup][key];
      if (typeof value == 'object') {
        prepareToEmit.payload = value.payload;
        if (value.to != null) {
          prepareToEmit.to = value.to;
          theSocket.of(prepareToEmit.to).emit(sender.event_key, prepareToEmit.payload);
          return;
        }
        theSocket.emit(sender.event_key, prepareToEmit.payload);
        return;
      }
      theSocket.emit(sender.event_key, value);
    }
  }
});