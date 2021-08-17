import BaseProto from "@root/base/BaseProto";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import ManageAdapterController from "../controllers/ManageAdapterController";
import ManageAdapterEventController from "../controllers/ManageAdapterEventController";
import ManageGatewayController from "../controllers/ManageGatewayController";
import ManageTestToolController from "../controllers/ManageTestToolController";

declare var masterData: MasterDataInterface

export default BaseProto.extend<BaseProtoInterface<any>>({
  construct(route: BaseRouteInterface) {
    /* Manage Adapter  */
    masterData.setOnListener('adapter.install', ManageAdapterController.binding().installAdapter);
    masterData.setOnListener('adapter.uninstall', ManageAdapterController.binding().uninstallAdapter);
    masterData.setOnListener('adapter.update', ManageAdapterController.binding().updateAdapter);
    masterData.setOnListener('adapter.start_all', ManageAdapterController.binding().startAll);

    /* Manage  Adapter Event */
    masterData.setOnListener('adapter.event.generate', ManageAdapterEventController.binding().generate);
    masterData.setOnListener('adapter.event.delete', ManageAdapterEventController.binding().delete);

    /* Manage Adapter Gateway */
    masterData.setOnListener('adapter.gateway.gateways', ManageGatewayController.binding().getGateways);
    masterData.setOnListener('adapter.gateway.view', ManageGatewayController.binding().getGateway);

    /* Manage Adapter Test Tool */
    masterData.setOnListener('adapter.test_tool.start', ManageTestToolController.binding().startTestTool);
  }
})