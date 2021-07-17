import BaseModel, { BaseModelInterface } from "@root/base/BaseModel";
import { Broker, BrokerEvent, Group, User } from "@root/models";

BrokerEvent.belongsTo(User,{
  foreignKey : 'user_id',
  as : 'user'
});

BrokerEvent.belongsTo(Group,{
  foreignKey : 'group_id',
  as : 'group'
})

BrokerEvent.belongsTo(Broker,{
  foreignKey : 'broker_id',
  as : 'broker'
  
})

export const BROKER_EVENT_STATUS = {
  ON : 1,
  OFF : 0
}

export interface BrokerEventModelInterface extends BaseModelInterface{}

export default BaseModel.extend<BrokerEventModelInterface>({
  model : BrokerEvent
});