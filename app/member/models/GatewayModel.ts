import GatewayModel from "@root/app/adapter/models/GatewayModel";
import { BaseModelInterface } from "@root/base/BaseModel";
import Gateway from "../sequelize/Gateway";

export interface GatewayModelInterface extends BaseModelInterface{}

export default GatewayModel.extend<GatewayModelInterface>({
  model: Gateway
})