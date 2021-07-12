import BaseProto from "@root/base/BaseProto";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import EventController from "../controllers/EventController";
import GroupController from "../controllers/GroupController";

declare var masterData: MasterDataInterface

export interface EventEmitterInterface extends BaseProtoInterface<any> { }

export default BaseProto.extend<EventEmitterInterface>({
  construct(route: BaseRouteInterface) {
    /* Manage Socket */
    masterData.setOnListener('broker.group.generate', GroupController.binding().generate)
    masterData.setOnListener('broker.group.start', GroupController.binding().start);
    masterData.setOnListener('broker.group.stop', GroupController.binding().stop);
    masterData.setOnListener('broker.group.delete', GroupController.binding().delete);
    masterData.setOnListener('broker.group.logs', GroupController.binding().logs);
    masterData.setOnListener('broker.group.start_groups', GroupController.binding().startAll);
    /* Manage event ws */
    masterData.setOnListener('broker.event.start_events', EventController.binding().startAll);
  }
});