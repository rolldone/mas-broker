import BaseProto from "@root/base/BaseProto";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import ManageBrokerController from "../controllers/ManageBrokerController";

declare var masterData: MasterDataInterface

export default BaseProto.extend<BaseProtoInterface<any>>({
  construct(route: BaseRouteInterface) {
    masterData.setOnListener('broker.install', ManageBrokerController.binding().installBroker);
    masterData.setOnListener('broker.uninstall', ManageBrokerController.binding().uninstallBroker);
    masterData.setOnListener('broker.brokers', ManageBrokerController.binding().getBrokers);
    masterData.setOnListener('broker.broker', ManageBrokerController.binding().getBroker);
    masterData.setOnListener('broker.update', ManageBrokerController.binding().updateBroker);
    masterData.setOnListener('broker.start_all',ManageBrokerController.binding().startAll);
  }
})