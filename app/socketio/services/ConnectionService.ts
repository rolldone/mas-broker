import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { AppConfig } from "@root/config";
import * as upath from 'upath';
import { EventServiceInterface } from "./EventService";
import { ADAPTER_EVENT_STATUS } from "../models/AdapterEventModel";
import AdapterModel, { AdapterModelInterface } from "../models/AdapterModel";


declare var masterData: MasterDataInterface;
declare var io: any;
declare var Server: any;

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
  _defineOnConnection?: { (ioServer: any, pathGroup: string, adapter_events: Array<any>, ws: any, req: any): void }
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
  _defineOnConnection: function (ioServer, pathGroup: string, adapter_events: Array<any>, io: any) {
    console.log('aaaaaaaaaaaaa', pathGroup, adapter_events);
    let self = this;

    /* Define websocket using websocket wrapper */
    var newWS = io;
    let socketClients: { [key: string]: any } = masterData.getData('socketio.clients', {}) as any;

    /* Get unique id */
    // newWS.id = uniqueId('socket-io-client-');

    if (socketClients[pathGroup] == null) {
      socketClients[pathGroup] = {}
      socketClients[pathGroup + '_of'] = {};
    }

    /* Define wrap websocket to socketClients with unique id */
    socketClients[pathGroup][newWS.id] = newWS;
    masterData.saveData('socket.clients', socketClients);

    /* Listen general websocket message */
    // newWS.on('message', (msg: any) => {
    //   /* This is native method result */
    //   // console.log('global', msg);
    // });

    /* Listen close trigger by user */
    newWS.on('disconnect', () => {
      console.log('get disconect from :');
      console.log(' ->', newWS.id);
      var runSocketClients: { [key: string]: any } = masterData.getData('socketio.clients', {}) as any;
      delete runSocketClients[pathGroup][newWS.id];
      delete runSocketClients[pathGroup+'_of'][newWS.id];
      masterData.saveData('socket.clients', runSocketClients);
    })

    /**
     * Listen user emit join 
     * Is used for group or private channel message */
    newWS.on('join', function (options: any, props: any) {
      console.log('options', options);
      console.log('props', props);
      /**
       * After define ws.collections  
       * Going to EventService@startSocketEvents  */
      options.ws.join(props.channel);
      let ws = options.ws.to(props.channel);
      /* Just for clue if want delete the event of this channel */
      console.log('options.ws.id', options.ws.id);
      socketClients[pathGroup + '_of'][options.ws.id] = ws;
      masterData.saveData('socket.clients', socketClients);

      /* Continue as use channel */
      self._eventService.startSocketEvents(ws, options.adapter_events);
      // setTimeout(() => {
      //   console.log('callback');
      //   options.ioServer.to(props.channel).emit('gagaga', 'test emit')
      // }, 5000);
    }.bind(this, {
      ioServer: ioServer,
      ws: newWS,
      pathGroup: pathGroup,
      adapter_events: adapter_events
    }));

    /**
     * After define ws.collections  
     * Going to EventService@startSocketEvents  */
    this._eventService.startSocketEvents(newWS, adapter_events);
  },

  /** Convert string to pathGroup */
  _getSocketPath: function (adapter_key) {
    if (adapter_key == null) {
      throw global.CustomError('error.missing.socket_io_base_path', 'Socket IO base path is null');
    }
    return upath.normalizeSafe('/' + AppConfig.BASE_SOCKET_IO_PATH + '/' + adapter_key);
  },

  /** Need AdapterModel on props */
  generateSocketConnection: function (props) {
    try {

      /* If group status is off just prevent it */
      if (props.status == ADAPTER_EVENT_STATUS.OFF) {
        return;
      }
      /* Call startSocketConnection */
      this.generateSocketConnection(props);
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
      } = masterData.getData('socketio_server.collections', {}) as any;

      /* If null just prevent it */
      if (socketCollections[pathGroup] != null) {
        return;
      }

      /* Close it the connection first and delete it and remember to save */
      socketCollections[pathGroup].close();
      delete socketCollections[pathGroup];
      masterData.saveData('socketio_server.collections', socketCollections);
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
      let socketioCollections: {
        [key: string]: any
      } = masterData.getData('socketio_server.collections', {}) as any;

      /* If null just prevent it */
      if (socketioCollections[pathGroup] != null) {
        return;
      }
      /* Create new websocket connection and create connection listener for listen new incoming request from user */
      socketioCollections[pathGroup] = io(Server, {
        path: pathGroup,
        transports: ['websocket', "polling"]
      });
      socketioCollections[pathGroup].on('connection', this._defineOnConnection.bind(this, socketioCollections[pathGroup], pathGroup, props.adapter_events));

      /* Save it to masterData */
      masterData.saveData('socketio_server.collections', socketioCollections);
    } catch (ex) {
      throw ex;
    }
  },
  logSocketConnection: function (props) {

  }
});