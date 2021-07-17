import BaseProto from "@root/base/BaseProto";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import EventController from "../controllers/EventController";
import ConnectionController from "../controllers/ConnectionController";

declare var masterData: MasterDataInterface

export interface EventEmitterInterface extends BaseProtoInterface<any> { }

export default BaseProto.extend<EventEmitterInterface>({
  construct(route: BaseRouteInterface) {
    /* Manage adapter websocket */
    masterData.setOnListener('adapter.connection.web_socket_server.connect',ConnectionController.binding().start);
    masterData.setOnListener('adapter.connection.web_socket_server.disconect',ConnectionController.binding().start);
    masterData.setOnListener('adapter.connection.web_socket_server.check',ConnectionController.binding().logs);
    /* Manage event ws */
    masterData.setOnListener('adapter.connection.web_socket_server.event.start',EventController.binding().start);
    masterData.setOnListener('adapter.connection.web_socket_server.event.start_all',EventController.binding().startAll);
    masterData.setOnListener('adapter.connection.web_socket_server.event.delete',EventController.binding().delete);
    masterData.setOnListener('adapter.connection.web_socket_server.event.get',EventController.binding().get);
    // masterData.setOnListener('websocket.event.generate', EventController.binding().generate);
    // masterData.setOnListener('websocket.event.start_events', EventController.binding().startAll);
    // masterData.setOnListener('websocket.event.delete', EventController.binding().delete);
    // masterData.setOnListener('websocket.event.start', EventController.binding().start);
    // masterData.setOnListener('websocket.event.stop', EventController.binding().stop);
    // masterData.setOnListener('websocket.event.logs', EventController.binding().logs);
    // masterData.setOnListener('websocket.event.log', EventController.binding().log);
  }
});