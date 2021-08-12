import GatewayModel, { GatewayModelInterface as MemberGatewayModelInterface} from "@root/app/member/models/GatewayModel";
import { AdapterEvent } from "@root/sequelize/models";
import Gateway from "@root/sequelize/models/Gateway";

export interface GatewayModelInterface extends MemberGatewayModelInterface {}
export default GatewayModel.extend<GatewayModelInterface>({
  model : Gateway
});