import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { AppConfig } from "@root/config";
import * as upath from 'upath';
import EventModel, { EVENT_STATUS } from "../models/EventModel";
import { GROUP_STATUS } from "../models/GroupModel";
import { EventServiceInterface } from "./EventService";
const WebSocketWrapper = require('ws-wrapper');
import url from 'url';
import { uniqueId } from "lodash";
import AdapterModel, { AdapterModelInterface } from "@root/app/adapter/models/AdapterModel";


declare var masterData: MasterDataInterface;
declare var WebSocket: any;

export interface ConnectionServiceInterface extends Omit<BaseServiceInterface,'create'> {
  create ?: (props:EventServiceInterface)=>this
  construct ?: {(props:EventServiceInterface):void}
  _eventService ?: EventServiceInterface
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
  construct : function(eventService){
    this._eventService = eventService;
  },
  _defineOnConnection: function (pathGroup: string,adapter_events:Array<any>, ws: any, req: any) {
    console.log('WebSocket headers => ');
    console.log(req.headers);
    let self = this;
    var newWS = new WebSocketWrapper(ws);
    let socketClients : { [key:string]:any} = masterData.getData('socket.clients', {}) as any;
    const query : any = url.parse(req.url,true).query;
    /* Get unique id */
    newWS.id = uniqueId('socket-client-');
    socketClients[newWS.id]= newWS;
    masterData.saveData('socket.clients',socketClients);

    newWS.on('message', (msg: any) => {
      /* This is native method result */
      // console.log('global', msg);
    });

    newWS.on('close',()=>{
      console.log('get disconect from :');
      console.log(' ->',newWS.id);
      var runSocketClients : { [key:string]:any} = masterData.getData('socket.clients', {}) as any;
      delete runSocketClients[newWS.id];
      masterData.saveData('socket.clients',runSocketClients);
    })
    
    /** Define ws as wsCollections  */
    let wsCollections: {
      [key: string]: any
    } = masterData.getData('ws.collections', {}) as any;
    // if (wsCollections[pathGroup] == null) {
      wsCollections[pathGroup] = newWS;
      masterData.saveData('ws.collections', wsCollections);
      newWS.on('join',function(options:any,props:any){
        options.wsCollections[options.pathGroup+'_of'] = options.ws.of(props.channel);
        masterData.saveData('ws.collections', options.wsCollections);
        /**
         * After define ws.collections  
         * Going to EventService@startSocketEvents  */
         self._eventService.startSocketEvents(options.adapter_events);
         
     }.bind(this,{
       ws : newWS,
       pathGroup : pathGroup,
       wsCollections : wsCollections,
       adapter_events: adapter_events
     }));
      /**
       * After define ws.collections  
       * Going to EventService@startSocketEvents  */
      this._eventService.startSocketEvents(adapter_events);
    // }
    
  },
  _getSocketPath: function (adapter_key) {
    if (adapter_key == null) {
      throw global.CustomError('error.missing.socket_base_path', 'Socket base path is null');
    }
    return upath.normalizeSafe('/' + AppConfig.BASE_SOCKET_PATH + '/' + adapter_key);
  },
  generateSocketConnection: function (props) {
    try {
      if (props.status == GROUP_STATUS.OFF) {
        return;
      }
      let pathGroup = this._getSocketPath(props.adapter_key);
      let socketCollections: {
        [key: string]: any
      } = masterData.getData('websocket_server.collections', {}) as any;
      if (socketCollections[pathGroup] != null) {
        return;
      }

      socketCollections[pathGroup] = new WebSocket.Server({ noServer: true });
      socketCollections[pathGroup].on('connection', this._defineOnConnection.bind(this, pathGroup));
      console.log('generateSocketConnection -> ', pathGroup);
      masterData.saveData('websocket_server.collections', socketCollections);
    } catch (ex) {
      throw ex;
    }
  },
  deleteSocketConnection: function (props) {
    try {
      let pathGroup = this._getSocketPath(props.adapter_key);
      let socketCollections: {
        [key: string]: any
      } = masterData.getData('websocket_server.collections', {}) as any;
      if (socketCollections[pathGroup] != null) {
        return;
      }
      socketCollections[pathGroup].close();
      delete socketCollections[pathGroup];
      console.log('stopSocketConnection -> ', pathGroup);
      masterData.saveData('websocket_server.collections', socketCollections);
    } catch (ex) {
      throw ex;
    }
  },
  /** Need GroupModel on props */
  stopSocketConnection: function (props) {
    this.deleteSocketConnection(props);
  },
  /** Need GroupModel on props */
  startSocketConnection: function (props) {
    try {
      let pathGroup = this._getSocketPath(props.adapter_key);
      let socketCollections: {
        [key: string]: any
      } = masterData.getData('websocket_server.collections', {}) as any;
      if (socketCollections[pathGroup] != null) {
        return;
      }
      socketCollections[pathGroup] = new WebSocket.Server({ noServer: true });
      socketCollections[pathGroup].on('connection', this._defineOnConnection.bind(this, pathGroup, props.adapter_events));
      masterData.saveData('websocket_server.collections', socketCollections);
      console.log('aaaaaaaaaaaaaaa',socketCollections);
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