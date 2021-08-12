import GatewayModel from "@root/app/adapter/models/GatewayModel";
import { BaseModelInterface } from "@root/base/BaseModel";
import { Gateway } from "@root/sequelize/models";

export interface GatewayModelInterface extends BaseModelInterface { }

export default GatewayModel.extend<GatewayModelInterface>({
  model: Gateway
})