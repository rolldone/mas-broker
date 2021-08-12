import GatewayModel, { GatewayModelInterface as MemberGatewayModelInterface} from "@root/app/member/models/GatewayModel";
import { Gateway } from "@root/sequelize/models";

export interface GatewayModelInterface extends MemberGatewayModelInterface {}
export default GatewayModel.extend<GatewayModelInterface>({
  model : Gateway
});