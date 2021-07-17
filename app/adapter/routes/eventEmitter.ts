import BaseProto from "@root/base/BaseProto";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import ManageAdapterController from "../controllers/ManageAdapterController";
import ManageAdapterEventController from "../controllers/ManageAdapterEventController";

declare var masterData: MasterDataInterface

export default BaseProto.extend<BaseProtoInterface<any>>({
  construct(route: BaseRouteInterface) {
    /* Manage Adapter  */
    masterData.setOnListener('adapter.install', ManageAdapterController.binding().installAdapter);
    masterData.setOnListener('adapter.uninstall', ManageAdapterController.binding().uninstallAdapter);
    masterData.setOnListener('adapter.adapters', ManageAdapterController.binding().getAdapters);
    masterData.setOnListener('adapter.adapter', ManageAdapterController.binding().getAdapter);
    masterData.setOnListener('adapter.update', ManageAdapterController.binding().updateAdapter);
    masterData.setOnListener('adapter.start_all', ManageAdapterController.binding().startAll);

    /* Manage  Adapter Event */
    masterData.setOnListener('adapter.event.generate', ManageAdapterEventController.binding().generate);
    masterData.setOnListener('adapter.event.delete', ManageAdapterEventController.binding().delete);
    masterData.setOnListener('adapter.event.event', ManageAdapterEventController.binding().get);
    masterData.setOnListener('adapter.event.events', ManageAdapterEventController.binding().gets);
  }
})