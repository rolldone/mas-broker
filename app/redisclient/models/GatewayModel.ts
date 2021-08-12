import GatewayModel, { GatewayModelInterface as MemberGatewayModelInterface } from "@root/app/member/models/GatewayModel";
import { Gateway } from "@root/sequelize/models";

export const GATEWAY_STATUS = {
  ON: 1,
  OFF: 0
}

export interface GatewayModelInterface extends MemberGatewayModelInterface { }
export default GatewayModel.extend<GatewayModelInterface>({
  model: Gateway
});