import BaseModel, { BaseModelInterface } from "@root/base/BaseModel";
import { Group, User } from "@root/models";
import Broker from "@root/models/Broker";

Broker.belongsTo(User,{
  foreignKey : 'user_id',
  as : 'user'
});

Broker.belongsTo(Group,{
  foreignKey : 'group_id',
  as : 'group'
})

export default BaseModel.extend<BaseModelInterface>({
  model : Broker
});