import BaseProto from "@root/base/BaseProto";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import EventController from "../controllers/EventController";
import GroupController from "../controllers/GroupController";

declare var masterData: MasterDataInterface

export interface EventEmitterInterface extends BaseProtoInterface<any> { }

export default BaseProto.extend<EventEmitterInterface>({
  construct(route: BaseRouteInterface) {
    /* Manage Socket */
    masterData.setOnListener('websocket.group.generate', GroupController.binding().generate)
    masterData.setOnListener('websocket.group.start', GroupController.binding().start);
    masterData.setOnListener('websocket.group.stop', GroupController.binding().stop);
    masterData.setOnListener('websocket.group.delete', GroupController.binding().delete);
    masterData.setOnListener('websocket.group.logs', GroupController.binding().logs);
    masterData.setOnListener('websocket.group.start_groups', GroupController.binding().startAll);
    /* Manage event ws */
    masterData.setOnListener('websocket.event.generate', EventController.binding().generate);
    masterData.setOnListener('websocket.event.start_events', EventController.binding().startAll);
    masterData.setOnListener('websocket.event.delete', EventController.binding().delete);
    masterData.setOnListener('websocket.event.start', EventController.binding().start);
    masterData.setOnListener('websocket.event.stop', EventController.binding().stop);
    masterData.setOnListener('websocket.event.logs', EventController.binding().logs);
    masterData.setOnListener('websocket.event.log', EventController.binding().log);
    /* Manage adapter websocket */
    masterData.setOnListener('adapter.connection.websocket.generate',GroupController.binding().generate);
  }
});