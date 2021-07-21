import GatewayModel, { GatewayModelInterface as MemberGatewayModelInterface} from "@root/app/member/models/GatewayModel";
import { AdapterEvent } from "@root/models";
import Gateway from "@root/models/Gateway";

Gateway.belongsTo(AdapterEvent,{
  foreignKey : 'sender_id',
  as : 'sender'
});

Gateway.belongsTo(AdapterEvent,{
  foreignKey : 'receiver_id',
  as : 'receiver'
});

export interface GatewayModelInterface extends MemberGatewayModelInterface {}
export default GatewayModel.extend<GatewayModelInterface>({
  model : Gateway
});