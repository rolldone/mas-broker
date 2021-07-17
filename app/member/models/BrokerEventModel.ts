import BrokerEventModel, { BrokerEventModelInterface as BrokerBrokerEventModelInterface} from "@root/app/broker/models/BrokerEventModel";
import { BrokerEvent } from "@root/models";

export interface BrokerEventModelInterface extends BrokerBrokerEventModelInterface{}

export default BrokerEventModel.extend<BrokerEventModelInterface>({
  model : BrokerEvent
});