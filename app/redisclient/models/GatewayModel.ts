import GatewayModel, { GatewayModelInterface as MemberGatewayModelInterface} from "@root/app/member/models/GatewayModel";
import { AdapterEvent } from "@root/models";
import Gateway from "../sequelize/Gateway";

Gateway.belongsTo(AdapterEvent,{
  foreignKey : 'sender_id',
  as : 'sender'
});

Gateway.belongsTo(AdapterEvent,{
  foreignKey : 'receiver_id',
  as : 'receiver'
});

export const GATEWAY_STATUS ={
  ON : 1,
  OFF : 0
}

export interface GatewayModelInterface extends MemberGatewayModelInterface {}
export default GatewayModel.extend<GatewayModelInterface>({
  model : Gateway
});