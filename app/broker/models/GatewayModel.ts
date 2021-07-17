import BaseModel, { BaseModelInterface } from "@root/base/BaseModel";
import { Group, User } from "@root/models";
import Gateway from "@root/models/Gateway";

Gateway.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

Gateway.belongsTo(Group, {
  foreignKey: 'group_id',
  as: 'group'
})

export default BaseModel.extend<BaseModelInterface>({
  model: Gateway
});