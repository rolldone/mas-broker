import BaseProto from "@root/base/BaseProto";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import ConnectionController from "../controllers/ConnectionController";

declare var masterData: MasterDataInterface

export interface EventEmitterInterface extends BaseProtoInterface<any> { }

export default BaseProto.extend<EventEmitterInterface>({
  construct(route: BaseRouteInterface) {
    /* Manage Connection */
    masterData.setOnListener('adapter.connection.socket_io_server.connect', ConnectionController.binding().start);
    masterData.setOnListener('adapter.connection.socket_io_server.disconect', ConnectionController.binding().stop);
    masterData.setOnListener('adapter.connection.socket_io_server.check', ConnectionController.binding().logs);

    /* Manage Event */
    // masterData.setOnListener('adapter.connection.redis.event.start',EventController.binding().add);
    // masterData.setOnListener('adapter.connection.redis.event.start_all',EventController.binding().addAll);
    // masterData.setOnListener('adapter.connection.redis.event.delete',EventController.binding().delete);
    // masterData.setOnListener('adapter.connection.redis.event.get',EventController.binding().get);
    // masterData.setOnListener('adapter.connection.redis.event.emit',EventController.binding().emit);
  }
})