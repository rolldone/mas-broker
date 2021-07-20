import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { ADAPTER_EVENT_STATUS } from "../models/AdapterEventModel";
import GatewayModel, { GatewayModelInterface } from "../models/GatewayModel";
import ConnectionService, { ConnectionServiceInterface } from "./ConnectionService";
import RedisEventService from "./RedisEventService";

declare var masterData: MasterDataInterface

export interface EventServiceInterface extends Omit<ConnectionServiceInterface, 'create'> {
  create?: (...props: any) => this
  returnGatewayModel?: { (): GatewayModelInterface }
  getGateways?: { (sender_id: number, props: any): Promise<any> }
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
    /* As the principle is same with Redis event service */
    RedisEventService.binding().getGateways(receiver_id, props);
  },
  deleteSocketEvent: async function (props) {

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
      console.log('bvbbbbbbbbbbbbbbb', events);
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
      console.log('theSocket', socketCollections);
      if (typeof value == 'object') {
        prepareToEmit.payload = value.payload;
        if (value.to != null) {
          prepareToEmit.to = value.to;
          theSocket.to(prepareToEmit.to).emit(sender.event_key, prepareToEmit.payload);
          return;
        }
        theSocket.emit(sender.event_key, prepareToEmit.payload);
        return;
      }
      theSocket.emit(sender.event_key, value);
    })
  }
});