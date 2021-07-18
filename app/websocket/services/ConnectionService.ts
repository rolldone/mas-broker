import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { AppConfig } from "@root/config";
import * as upath from 'upath';
import { GROUP_STATUS } from "../models/GroupModel";
import { EventServiceInterface } from "./EventService";
const WebSocketWrapper = require('ws-wrapper');
import url from 'url';
import { uniqueId } from "lodash";
import AdapterModel, { AdapterModelInterface } from "@root/app/adapter/models/AdapterModel";


declare var masterData: MasterDataInterface;
declare var WebSocket: any;

export interface ConnectionServiceInterface extends Omit<BaseServiceInterface, 'create'> {
  create?: (props: EventServiceInterface) => this
  construct?: { (props: EventServiceInterface): void }
  _eventService?: EventServiceInterface
  returnAdapterModel?: { (): AdapterModelInterface }
  generateSocketConnection?: { (props: any): void }
  deleteSocketConnection?: { (props: any): void }
  stopSocketConnection?: { (props: any): void }
  logSocketConnection?: { (props: any): void }
  startSocketConnection?: { (props: any): void }
  _defineOnConnection?: { (pathGroup: string, adapter_events: Array<any>, ws: any, req: any): void }
  _getSocketPath?: { (adapter_key: string): string }
}

export default BaseService.extend<ConnectionServiceInterface>({
  returnAdapterModel: function () {
    return AdapterModel.create();
  },
  construct: function (eventService) {
    this._eventService = eventService;
  },

  /** Function handle connection event on websocket */
  _defineOnConnection: function (pathGroup: string, adapter_events: Array<any>, ws: any, req: any) {
    console.log('WebSocket headers => ');
    console.log(req.headers);
    let self = this;

    /* Define websocket using websocket wrapper */
    var newWS = new WebSocketWrapper(ws);
    let socketClients: { [key: string]: any } = masterData.getData('socket.clients', {}) as any;

    /* Get query from request url connection upgrade */
    const query: any = url.parse(req.url, true).query;

    /* Get unique id */
    newWS.id = uniqueId('socket-client-');

    if(socketClients[pathGroup] == null){
      socketClients[pathGroup] = {}
      socketClients[pathGroup+'_of'] = {};
    }

    /* Define wrap websocket to socketClients with unique id */
    socketClients[pathGroup][newWS.id] = newWS;
    masterData.saveData('socket.clients', socketClients);

    /* Listen general websocket message */
    newWS.on('message', (msg: any) => {
      /* This is native method result */
      // console.log('global', msg);
    });

    /* Listen close trigger by user */
    newWS.on('close', () => {
      console.log('get disconect from :');
      console.log(' ->', newWS.id);
      var runSocketClients: { [key: string]: any } = masterData.getData('socket.clients', {}) as any;
      delete runSocketClients[newWS.id];
      masterData.saveData('socket.clients', runSocketClients);
    })

    /** Define ws as wsCollections  */
    // let wsCollections: {
    //   [key: string]: any
    // } = masterData.getData('ws.collections', {}) as any;

    /* This is just replace from old wsCollection before if exist why?
       Because we have collecting socket.clients for emit on listen msg
     */
    // wsCollections[pathGroup] = newWS;
    // masterData.saveData('ws.collections', wsCollections);

    /**
     * Listen user emit join 
     * Is used for group or private channel message */
    newWS.on('join', function (options: any, props: any) {
      /**
       * After define ws.collections  
       * Going to EventService@startSocketEvents  */
      let ws = options.ws.of(props.channel);
      
      /* Just for clue if want delete the event of this channel */
      socketClients[pathGroup+'_of'][ws.id] = ws;
      masterData.saveData('socket.clients', socketClients);

      self._eventService.startSocketEvents(ws,options.adapter_events);

    }.bind(this, {
      ws: newWS,
      pathGroup: pathGroup,
      adapter_events: adapter_events
    }));

    /**
     * After define ws.collections  
     * Going to EventService@startSocketEvents  */
    this._eventService.startSocketEvents(newWS,adapter_events);
  },

  /** Convert string to pathGroup */
  _getSocketPath: function (adapter_key) {
    if (adapter_key == null) {
      throw global.CustomError('error.missing.socket_base_path', 'Socket base path is null');
    }
    return upath.normalizeSafe('/' + AppConfig.BASE_SOCKET_PATH + '/' + adapter_key);
  },

  /** Need AdapterModel on props */
  generateSocketConnection: function (props) {
    try {

      /* If group status is off just prevent it */
      if (props.status == GROUP_STATUS.OFF) {
        return;
      }

      /* Define pathGroup from adapter_key like this -> /socket/29mdfmvkfdv934mvakdfmvakdfvmkfdv */
      let pathGroup = this._getSocketPath(props.adapter_key);
      let socketCollections: {
        [key: string]: any
      } = masterData.getData('websocket_server.collections', {}) as any;
      if (socketCollections[pathGroup] != null) {
        return;
      }

      /* Create new websocket connection and create connection listener for listen new incoming request from user */
      socketCollections[pathGroup] = new WebSocket.Server({ noServer: true });
      socketCollections[pathGroup].on('connection', this._defineOnConnection.bind(this, pathGroup));

      /* Save it to masterData */
      masterData.saveData('websocket_server.collections', socketCollections);

    } catch (ex) {
      throw ex;
    }
  },

  /** Need AdapterModel on props */
  deleteSocketConnection: function (props) {
    try {

      /* Define pathGroup from adapter_key like this -> /socket/29mdfmvkfdv934mvakdfmvakdfvmkfdv */
      let pathGroup = this._getSocketPath(props.adapter_key);
      let socketCollections: {
        [key: string]: any
      } = masterData.getData('websocket_server.collections', {}) as any;

      /* If null just prevent it */
      if (socketCollections[pathGroup] != null) {
        return;
      }

      /* Close it the connection first and delete it and remember to save */
      socketCollections[pathGroup].close();
      delete socketCollections[pathGroup];
      masterData.saveData('websocket_server.collections', socketCollections);

    } catch (ex) {
      throw ex;
    }
  },

  /** Need AdapterModel on props */
  stopSocketConnection: function (props) {
    this.deleteSocketConnection(props);
  },

  /** Need AdapterModel on props */
  startSocketConnection: function (props) {
    try {

      /* Define pathGroup from adapter_key like this -> /socket/29mdfmvkfdv934mvakdfmvakdfvmkfdv */
      let pathGroup = this._getSocketPath(props.adapter_key);
      let socketCollections: {
        [key: string]: any
      } = masterData.getData('websocket_server.collections', {}) as any;

      /* If null just prevent it */
      if (socketCollections[pathGroup] != null) {
        return;
      }

      /* Create new websocket connection and create connection listener for listen new incoming request from user */
      socketCollections[pathGroup] = new WebSocket.Server({ noServer: true });
      socketCollections[pathGroup].on('connection', this._defineOnConnection.bind(this, pathGroup, props.adapter_events));

      /* Save it to masterData */
      masterData.saveData('websocket_server.collections', socketCollections);

    } catch (ex) {
      throw ex;
    }
  },
  logSocketConnection: function (props) {
    try {
      let pathGroup = this._getSocketPath(props.adapter_key);
      let socketCollections: {
        [key: string]: any
      } = masterData.getData('websocket_server.collections', {}) as any;
      if (socketCollections[pathGroup] != null) {
        return;
      }
      socketCollections[pathGroup].on('connection', this._defineOnConnection.bind(this, pathGroup, props.adapter_events));
    } catch (ex) {
      throw ex;
    }
  }
});