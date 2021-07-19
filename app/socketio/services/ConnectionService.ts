import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { AppConfig } from "@root/config";
import * as upath from 'upath';
import { EventServiceInterface } from "./EventService";
const WebSocketWrapper = require('ws-wrapper');
import url from 'url';
import { uniqueId } from "lodash";
import AdapterModel, { AdapterModelInterface } from "@root/app/adapter/models/AdapterModel";


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
  _defineOnConnection: function (pathGroup: string, adapter_events: Array<any>, io: any) {
    console.log('aaaaaaaaaaaaa',pathGroup,adapter_events);
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

  },

  /** Need AdapterModel on props */
  deleteSocketConnection: function (props) {

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
        // transports : ['websocket']
      });
      socketioCollections[pathGroup].on('connection', this._defineOnConnection.bind(this, pathGroup, props.adapter_events));

      /* Save it to masterData */
      masterData.saveData('socketio_server.collections', socketioCollections);
    } catch (ex) {
      throw ex;
    }
  },
  logSocketConnection: function (props) {

  }
});