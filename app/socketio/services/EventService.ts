import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { ADAPTER_EVENT_STATUS } from "../models/AdapterEventModel";
import { AdapterModelInterface } from "../models/AdapterModel";
import GatewayModel, { GatewayModelInterface } from "../models/GatewayModel";
import ConnectionService from "./ConnectionService";
import RedisEventService from "./RedisEventService";

declare var masterData: MasterDataInterface

export interface EventServiceInterface extends BaseServiceInterface {
  returnAdapterModel: { (): AdapterModelInterface }
  returnGatewayModel?: { (): GatewayModelInterface }
  getGateways?: { (sender_id: number, props: any): Promise<any> }
  deleteSocketEvent?: { (props: any): void }
  startSocketEvents?: { (ws: any, events?: Array<any>): void }
  stopSocketEvent?: { (props: any): void }
  startSocketEvent?: { (props: any): void }
  logSocketEvent?: { (props: any): void }
  logSocketEvents?: { (props: any): void }
  emit: { (props: any): void }
  _getSocketPath: { (adapter_key: string): string }
}

export default BaseService.mixin<EventServiceInterface>({
  returnAdapterModel: ConnectionService.returnAdapterModel,
  returnGatewayModel: function () {
    return GatewayModel.create();
  },
  _getSocketPath: ConnectionService._getSocketPath,
  getGateways: RedisEventService.getGateways,
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
        let socketCollections: { [key: string]: any } = masterData.getData('socketio.clients', {}) as any;
        if (socketCollections[pathGroup] == null) {
          throw global.CustomError('error.ws.not_found', 'The socket with adapter_key ' + adapter.adapter_key + ' is not found!');
        }
        for (var key in socketCollections[pathGroup]) {
          /** Basic ws remove listener */
          // wsCollections[pathGroup].removeEventListener('message', wsCollections[pathGroup].wsFuncs[events[a].event_key].bind(this, events[a].event_key));
          /** Modern ws with websocket wrapper method listener */
          socketCollections[pathGroup][key].off(events[a].event_key, socketCollections[pathGroup][key].wsFuncs[events[a].event_key].bind(this, socketCollections[pathGroup][key], events[a].event_key));
          /* With channel */
          if (socketCollections[pathGroup + '_of'][key] != null) {
            socketCollections[pathGroup + '_of'][key].off(events[a].event_key, socketCollections[pathGroup + '_of'][key].wsFuncs[events[a].event_key].bind(this, socketCollections[pathGroup + '_of'][key], events[a].event_key));
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
  /** Add new socket event */
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

      /* Get all client socket io */
      let socketClients: { [key: string]: any } = masterData.getData('socketio.clients', {}) as any;
      let pathGroup = this._getSocketPath(props.adapter.adapter_key);
      if (socketClients[pathGroup] == null) {
        throw global.CustomError('error.socketio.not_found', 'The socket io with adapter_key ' + props.adapter.adapter_key + ' is not found!');
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

            /* Test tool */
            masterData.saveData('adapter.test_tool.listen', {
              event_key: adapter_event.event_key,
              adapter_event: adapter_event,
              from: props
            });

            this.getGateways(adapter_event.id, {
              to: news_of.name,
              payload: props
            });
          }
        }

        /** Remove the listener first before create new if exist */
        ws.off(events[a].event_key, ws.wsFuncs[events[a].event_key].bind(this, pathGroup, ws, events[a]))
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
    /* As the principle is same with Redis event service */
    RedisEventService.binding().emit(props, (props: any) => {
      /* Is it happen when middleware set done(null) */
      if (props == null) {
        return;
      }
      let socketCollections: { [key: string]: any } = masterData.getData('socketio_server.collections', {}) as any;
      let value = props.value;
      let gateway = props.gateway;
      let sender = gateway.sender;
      let sender_adapter = sender.adapter;
      let pathGroup = this._getSocketPath(sender_adapter.adapter_key);
      if (socketCollections[pathGroup] == null) {
        return;
      }
      let prepareToEmit = {} as any;
      let theSocket = socketCollections[pathGroup];
      // console.log('theSocket', socketCollections);

      /* Test tool */
      masterData.saveData('adapter.test_tool.listen', {
        event_key: sender.event_key,
        adapter_event: sender,
        from: value
      });

      if (typeof value == 'object') {
        prepareToEmit.payload = value.payload;
        if (value.to != null) {
          prepareToEmit.to = value.to;
          theSocket.to(prepareToEmit.to).emit(sender.event_key, prepareToEmit.payload);
          return;
        }
        theSocket.emit(sender.event_key, prepareToEmit.payload || value);
        return;
      }
      theSocket.emit(sender.event_key, value || props);
    })
  }
});