import { EventModelInterface } from "@root/app/member/models/EventModel";
import { GroupModelInterface } from "@root/app/member/models/GroupModel";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import EventModel, { EVENT_STATUS } from "../models/EventModel";
import { GROUP_STATUS } from "../models/GroupModel";
import GroupService, { ConnectionServiceInterface } from "./ConnectionService";
const WebSocketWrapper = require('ws-wrapper');

declare var masterData: MasterDataInterface

export interface EventServiceInterface extends Omit<ConnectionServiceInterface, 'create'> {
  create?: (...props: any) => this
  returnEventModel?: { (): EventModelInterface }
  generateSocketEvent?: { (props: any): void }
  deleteSocketEvent?: { (props: any): void }
  startSocketEvents?: { (events?: Array<any>): void }
  stopSocketEvent?: { (props: any): void }
  startSocketEvent?: { (props: any): void }
  logSocketEvent?: { (props: any): void }
  logSocketEvents?: { (props: any): void }
}

export default GroupService.extend<EventServiceInterface>({
  returnEventModel: function () {
    return EventModel.create();
  },
  generateSocketEvent: async function (props) {
    try {
      if (props.status == EVENT_STATUS.OFF) {
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
      if (props.status == EVENT_STATUS.OFF) {
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
        let wsCollections: {
          [key: string]: any
        } = masterData.getData('ws.collections', {}) as any;

        if (wsCollections[pathGroup] == null) {
          throw global.CustomError('error.ws.not_found', 'The socket with adapter_key ' + adapter.adapter_key + ' is not found!');
        }

        /** Basic ws remove listener */
        // wsCollections[pathGroup].removeEventListener('message', wsCollections[pathGroup].wsFuncs[events[a].event_key].bind(this, events[a].event_key));
        /** Modern ws with websocket wrapper method listener */
        wsCollections[pathGroup].removeListener(events[a].event_key, wsCollections[pathGroup].wsFuncs[events[a].event_key].bind(this, wsCollections[pathGroup], events[a].event_key));
        /* With channel */
        if (wsCollections[pathGroup + '_of'] != null) {
          wsCollections[pathGroup + '_of'].removeListener(events[a].event_key, wsCollections[pathGroup].wsFuncs[events[a].event_key].bind(this, wsCollections[pathGroup + '_of'], events[a].event_key));
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
      if (props.status == EVENT_STATUS.OFF) {
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
      this.startSocketEvents([props]);
    } catch (ex) {
      throw ex;
    }
  },
  startSocketEvents: async function (events = []) {
    try {
      if (events.length == 0) {
        return;
      }
      console.log('oooooooooooooooooo',events);
      for (var a = 0; a < events.length; a++) {
        let adapter = events[a].adapter;
        let pathGroup = this._getSocketPath(adapter.adapter_key);
        let wsCollections: {
          [key: string]: any
        } = masterData.getData('ws.collections', {}) as any;

        if (wsCollections[pathGroup] == null) {
          throw global.CustomError('error.ws.not_found', 'The socket with adapter_key ' + adapter.adapter_key + ' is not found!');
        }

        if (wsCollections[pathGroup].wsFuncs == null) {
          wsCollections[pathGroup].wsFuncs = {} as any;
        }

        /** Listen all event from channel or public */
        if (wsCollections[pathGroup].wsFuncs[events[a].event_key] == null) {
          wsCollections[pathGroup].wsFuncs[events[a].event_key] = function (news_of: any, event_key: string, ...props: any) {
            /* You can log this area */
            // news_of.emit(event_key,'test');
            console.log('props',props);
            let socketCollections: { [key: string]: any } = masterData.getData('socket.clients', {}) as any;
            for (var key in socketCollections) {
              socketCollections[key].emit(event_key, ...props);
            }
          }
        }

        /** Basic ws remove listener */
        // wsCollections[pathGroup].removeEventListener('message', wsCollections[pathGroup].wsFuncs[events[a].event_key].bind(this, events[a].event_key));
        /** Modern ws with websocket wrapper method listener */
        wsCollections[pathGroup].removeListener(events[a].event_key, wsCollections[pathGroup].wsFuncs[events[a].event_key].bind(this, wsCollections[pathGroup], events[a].event_key));
        /** Basic ws method */
        // wsCollections[pathGroup].on('message', wsCollections[pathGroup].wsFuncs[events[a].event_key].bind(this, events[a].event_key));
        /** This method WRapped by websocketwrapper */
        wsCollections[pathGroup].on(events[a].event_key, wsCollections[pathGroup].wsFuncs[events[a].event_key].bind(this, wsCollections[pathGroup], events[a].event_key));

        /* With channel */
        if (wsCollections[pathGroup + '_of'] != null) {
          wsCollections[pathGroup + '_of'].removeListener(events[a].event_key, wsCollections[pathGroup].wsFuncs[events[a].event_key].bind(this, wsCollections[pathGroup + '_of'], events[a].event_key));
          wsCollections[pathGroup + '_of'].on(events[a].event_key, wsCollections[pathGroup].wsFuncs[events[a].event_key].bind(this, wsCollections[pathGroup + '_of'], events[a].event_key));
        }
      }
    } catch (ex) {
      throw ex;
    }
  },
  logSocketEvent: function (props) {

  },
  logSocketEvents: function (props) {

  }
});