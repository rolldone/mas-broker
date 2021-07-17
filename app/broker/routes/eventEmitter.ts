import BaseProto from "@root/base/BaseProto";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import ManageBrokerController from "../controllers/ManageBrokerController";
import ManageBrokerEventController from "../controllers/ManageBrokerEventController";

declare var masterData: MasterDataInterface

export default BaseProto.extend<BaseProtoInterface<any>>({
  construct(route: BaseRouteInterface) {
    /* Manage Broker  */
    masterData.setOnListener('broker.install', ManageBrokerController.binding().installBroker);
    masterData.setOnListener('broker.uninstall', ManageBrokerController.binding().uninstallBroker);
    masterData.setOnListener('broker.brokers', ManageBrokerController.binding().getBrokers);
    masterData.setOnListener('broker.broker', ManageBrokerController.binding().getBroker);
    masterData.setOnListener('broker.update', ManageBrokerController.binding().updateBroker);
    masterData.setOnListener('broker.start_all', ManageBrokerController.binding().startAll);

    /* Manage  Broker Event */
    masterData.setOnListener('broker.event.generate', ManageBrokerEventController.binding().generate);
    masterData.setOnListener('broker.event.delete', ManageBrokerEventController.binding().delete);
    masterData.setOnListener('broker.event.event', ManageBrokerEventController.binding().get);
    masterData.setOnListener('broker.event.events', ManageBrokerEventController.binding().gets);
  }
})