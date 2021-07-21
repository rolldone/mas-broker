import BaseProto from "@root/base/BaseProto";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import ConnectionController from "../controllers/ConnectionController";
import EventController from "../controllers/EventController";

declare var masterData: MasterDataInterface

export interface EventEmitterInterface extends BaseProtoInterface<any> { }

export default BaseProto.extend<EventEmitterInterface>({
  construct(route: BaseRouteInterface) {
    /* Manage Connection */
    masterData.setOnListener('adapter.connection.socket_io_server.connect', ConnectionController.binding().start);
    masterData.setOnListener('adapter.connection.socket_io_server.disconect', ConnectionController.binding().stop);
    masterData.setOnListener('adapter.connection.socket_io_server.check', ConnectionController.binding().logs);

    /* Manage event socketio */
    masterData.setOnListener('adapter.connection.socket_io_server.event.start', EventController.binding().start);
    masterData.setOnListener('adapter.connection.socket_io_server.event.start_all', EventController.binding().startAll);
    masterData.setOnListener('adapter.connection.socket_io_server.event.delete', EventController.binding().delete);
    masterData.setOnListener('adapter.connection.socket_io_server.event.get', EventController.binding().get);
    masterData.setOnListener('adapter.connection.socket_io_server.event.emit', EventController.binding().emit);
  }
})