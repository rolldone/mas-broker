import BrokerModel, { BrokerModelInterface as BrokerBrokerModelInterface } from "@root/app/broker/models/BrokerModel";

export interface BrokerModelInterface extends BrokerBrokerModelInterface { }

export default BrokerModel.extend<BrokerModelInterface>({
  model: BrokerModel.binding().model
});