import GroupModel, { GroupModelInterface } from "@root/app/member/models/GroupModel";
import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { AppConfig } from "@root/config";
import * as upath from 'upath';
import EventModel, { EVENT_STATUS } from "../models/EventModel";
import { GROUP_STATUS } from "../models/GroupModel";
import { EventServiceInterface } from "./EventService";
const WebSocketWrapper = require('ws-wrapper');
import url from 'url';


declare var masterData: MasterDataInterface;
declare var WebSocket: any;

export interface GroupServiceInterface extends Omit<BaseServiceInterface,'create'> {
  create ?: (props:EventServiceInterface)=>this
  construct ?: {(props:EventServiceInterface):void}
  _eventService ?: EventServiceInterface
  returnGroupModel?: { (): GroupModelInterface }
  generateSocketGroup?: { (props: any): void }
  deleteSocketGroup?: { (props: any): void }
  startSocketGroups?: { (): void }
  stopSocketGroup?: { (props: any): void }
  logSocketGroup?: { (props: any): void }
  startSocketGroup?: { (props: any): void }
  _defineOnConnection?: { (pathGroup: string, events: Array<any>, ws: any, req: any): void }
  _getSocketPath?: { (group_key: string): string }
}

export default BaseService.extend<GroupServiceInterface>({
  returnGroupModel: function () {
    return GroupModel.create();
  },
  construct : function(eventService){
    this._eventService = eventService;
  },
  _defineOnConnection: function (pathGroup: string,events:Array<any>, ws: any, req: any) {
    
  
    console.log('req -> ', req.headers);
    let self = this;
    var newWS = new WebSocketWrapper(ws);
    let socketClients : { [key:string]:any} = masterData.getData('socket.clients', {}) as any;
    const query : any = url.parse(req.url,true).query;
    newWS.id = query.id;
    console.log('vmdkfvmdfv',query.id);
    socketClients[newWS.id]= newWS;
    masterData.saveData('socket.clients',socketClients);

    newWS.on('message', (msg: any) => {
      /* This is native method result */
      // console.log('global', msg);
    });
    
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
         self._eventService.startSocketEvents(options.events);
         
     }.bind(this,{
       ws : newWS,
       pathGroup : pathGroup,
       wsCollections : wsCollections,
       events: events
     }));
      /**
       * After define ws.collections  
       * Going to EventService@startSocketEvents  */
      this._eventService.startSocketEvents(events);
    // }
    
  },
  _getSocketPath: function (group_key) {
    if (group_key == null) {
      throw global.CustomError('error.missing.socket_base_path', 'Socket base path is null');
    }
    return upath.normalizeSafe('/' + AppConfig.BASE_SOCKET_PATH + '/' + group_key);
  },
  generateSocketGroup: function (props) {
    try {
      if (props.status == GROUP_STATUS.OFF) {
        return;
      }
      let pathGroup = this._getSocketPath(props.group_key);
      let socketCollections: {
        [key: string]: any
      } = masterData.getData('socket.collections', {}) as any;
      if (socketCollections[pathGroup] != null) {
        return;
      }

      socketCollections[pathGroup] = new WebSocket.Server({ noServer: true });
      socketCollections[pathGroup].on('connection', this._defineOnConnection.bind(this, pathGroup));
      console.log('generateSocketGroup -> ', pathGroup);
      masterData.saveData('socket.collections', socketCollections);
    } catch (ex) {
      throw ex;
    }
  },
  deleteSocketGroup: function (props) {
    try {
      let pathGroup = this._getSocketPath(props.group_key);
      let socketCollections: {
        [key: string]: any
      } = masterData.getData('socket.collections', {}) as any;
      if (socketCollections[pathGroup] != null) {
        return;
      }
      socketCollections[pathGroup].close();
      delete socketCollections[pathGroup];
      console.log('stopSocketGroup -> ', pathGroup);
      masterData.saveData('socket.collections', socketCollections);
    } catch (ex) {
      throw ex;
    }
  },
  /** Need GroupModel on props */
  stopSocketGroup: function (props) {
    this.deleteSocketGroup(props);
  },
  /** Need GroupModel on props */
  startSocketGroup: function (props) {
    try {
      let pathGroup = this._getSocketPath(props.group_key);
      let socketCollections: {
        [key: string]: any
      } = masterData.getData('socket.collections', {}) as any;
      if (socketCollections[pathGroup] != null) {
        return;
      }
      socketCollections[pathGroup] = new WebSocket.Server({ noServer: true });
      socketCollections[pathGroup].on('connection', this._defineOnConnection.bind(this, pathGroup, props.events));
      socketCollections[pathGroup].on('close',function(){
        console.log('cloooooooooooooooooo server');
      })
      masterData.saveData('socket.collections', socketCollections);
    } catch (ex) {
      throw ex;
    }
  },
  logSocketGroup: function (props) {
    try {
      let pathGroup = this._getSocketPath(props.group_key);
      let socketCollections: {
        [key: string]: any
      } = masterData.getData('socket.collections', {}) as any;
      if (socketCollections[pathGroup] != null) {
        return;
      }
      socketCollections[pathGroup].on('connection', this._defineOnConnection.bind(this, pathGroup, props.events));
    } catch (ex) {
      throw ex;
    }
  },
  startSocketGroups: async function () {
    try {
      let groupModel = this.returnGroupModel();
      groupModel.nest = true;
      let resData = await groupModel.get({
        where: {
          status: GROUP_STATUS.ON
        },
        include: [{
          model: EventModel.model,
          as: 'events',
          required: false,
          where: {

            status: EVENT_STATUS.ON
          },
          include: [{
            model: GroupModel.model,
            as: 'group',
          }]
        }]
      });
      resData = groupModel.getJSON(resData);
      for (var a = 0; a < resData.length; a++) {
        this.startSocketGroup(resData[a])
        
      }
    } catch (ex) {
      throw ex;
    }
  },
});