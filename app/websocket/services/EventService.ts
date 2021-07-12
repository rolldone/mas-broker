import { EventModelInterface } from "@root/app/member/models/EventModel";
import { GroupModelInterface } from "@root/app/member/models/GroupModel";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import EventModel, { EVENT_STATUS } from "../models/EventModel";
import GroupModel, { GROUP_STATUS } from "../models/GroupModel";
import GroupService, { GroupServiceInterface } from "./GroupService";
const WebSocketWrapper = require('ws-wrapper');


declare var masterData: MasterDataInterface



export interface EventServiceInterface extends Omit<GroupServiceInterface, 'create'> {
  create?: (...props: any) => this
  returnEventModel?: { (): EventModelInterface }
  returnGroupModel?: { (): GroupModelInterface }
  generateSocketEvent?: { (props: any): void }
  deleteSocketEvent?: { (props: any): void }
  startSocketEvents?: { (events?: Array<any>): void }
  stopSocketEvent?: { (props: any): void }
  startSocketEvent?: { (props: any): void }
}

export default GroupService.extend<EventServiceInterface>({
  returnEventModel: function () {
    return EventModel.create();
  },
  returnGroupModel: function () {
    return GroupModel.create();
  },
  generateSocketEvent: async function (props) {
    try {
      if (props.status == EVENT_STATUS.OFF) {
        return;
      }
      let groupModel = this.returnGroupModel();
      let resDataGroupModel = await groupModel.first({
        where: {
          id: props.group_id,
          status: GROUP_STATUS.ON
        }
      })
      let pathGroup = this._getSocketPath(resDataGroupModel.group_key);
      let wsCollections: {
        [key: string]: any
      } = masterData.getData('ws.collections', {}) as any;
      if (wsCollections[pathGroup] == null) {
        throw global.CustomError('error.not_found', 'The socket with group_key ' + resDataGroupModel.group_key + ' is not found!');
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
      wsCollections[pathGroup].on('test',function(props:any){
        console.log('test from server -> ',props);
      })
    } catch (ex) {
      throw ex;
    }
  },
  deleteSocketEvent: function (props) {
    try {

    } catch (ex) {
      throw ex;
    }
  },
  stopSocketEvent: function (props) {
    try {

    } catch (ex) {
      throw ex;
    }
  },
  startSocketEvent: async function (props) {
    try {
      if (props.status == EVENT_STATUS.OFF) {
        return;
      }
      let groupModel = this.returnGroupModel();
      let resDataGroupModel = await groupModel.first({
        where: {
          id: props.group_id,
          status: GROUP_STATUS.ON
        }
      })

    } catch (ex) {
      throw ex;
    }
  },
  startSocketEvents: async function (events = []) {
    try {
      if (events.length == 0) {
        return;
      }
      for (var a = 0; a < events.length; a++) {
        let group = events[a].group;
        let pathGroup = this._getSocketPath(group.group_key);
        let wsCollections: {
          [key: string]: any
        } = masterData.getData('ws.collections', {}) as any;

        if (wsCollections[pathGroup] == null) {
          throw global.CustomError('error.ws.not_found', 'The socket with group_key ' + group.group_key + ' is not found!');
        }
        
        if (wsCollections[pathGroup].wsFuncs == null) {
          wsCollections[pathGroup].wsFuncs = {} as any;
        }

        /** Listen all event from channel or public */
        if (wsCollections[pathGroup].wsFuncs[events[a].event_key] == null) {
          wsCollections[pathGroup].wsFuncs[events[a].event_key] = function (news_of:any,event_key: string, ...props:any) {
            // console.log('vmfkdmvfv',event_key,props)
            /* You can log this session */
            // console.log('vdmfkvfv',event_key);
            // news_of.emit(event_key,'aaaaaaaaaaaaaaaaaaaaaaaaaaaa');
            let socketCollections : {[key:string]:any} = masterData.getData('socket.clients',{}) as any;
            for(var key in socketCollections){
              console.log('keyyyyyyyyyyyyyy',key);
              socketCollections[key].emit(event_key,'vmadfkvmdfkvmdkvmdkvm')
            }
          
          }
        }

        /** Basic ws remove listener */
        // wsCollections[pathGroup].removeEventListener('message', wsCollections[pathGroup].wsFuncs[events[a].event_key].bind(this, events[a].event_key));
        /** Modern ws with websocket wrapper method listener */
        wsCollections[pathGroup].removeListener(events[a].event_key, wsCollections[pathGroup].wsFuncs[events[a].event_key].bind(this, wsCollections[pathGroup],events[a].event_key));
        /** Basic ws method */
        // wsCollections[pathGroup].on('message', wsCollections[pathGroup].wsFuncs[events[a].event_key].bind(this, events[a].event_key));
        /** This method WRapped by websocketwrapper */
        wsCollections[pathGroup].on(events[a].event_key,wsCollections[pathGroup].wsFuncs[events[a].event_key].bind(this, wsCollections[pathGroup],events[a].event_key));
        
        /* With channel */
        if(wsCollections[pathGroup+'_of'] != null){
          wsCollections[pathGroup+'_of'].removeListener(events[a].event_key, wsCollections[pathGroup].wsFuncs[events[a].event_key].bind(this, wsCollections[pathGroup+'_of'],events[a].event_key));
          wsCollections[pathGroup+'_of'].on(events[a].event_key,wsCollections[pathGroup].wsFuncs[events[a].event_key].bind(this, wsCollections[pathGroup+'_of'],events[a].event_key));
        }
        // console.log('pathGroup',wsCollections[pathGroup]);
       
      }
    } catch (ex) {
      throw ex;
    }
  },
});