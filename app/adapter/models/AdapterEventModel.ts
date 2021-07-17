import BaseModel, { BaseModelInterface } from "@root/base/BaseModel";
import { Adapter, AdapterEvent, Group, User } from "@root/models";

AdapterEvent.belongsTo(User,{
  foreignKey : 'user_id',
  as : 'user'
});

AdapterEvent.belongsTo(Group,{
  foreignKey : 'group_id',
  as : 'group'
})

AdapterEvent.belongsTo(Adapter,{
  foreignKey : 'adapter_id',
  as : 'adapter'
  
})

export const BROKER_EVENT_STATUS = {
  ON : 1,
  OFF : 0
}

export interface AdapterEventModelInterface extends BaseModelInterface{}

export default BaseModel.extend<AdapterEventModelInterface>({
  model : AdapterEvent
});