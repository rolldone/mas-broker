import BaseModel, { BaseModelInterface } from "@root/base/BaseModel";
import Gateway from "@root/sequelize/models/Gateway";

export default BaseModel.extend<BaseModelInterface>({
  model: Gateway
});