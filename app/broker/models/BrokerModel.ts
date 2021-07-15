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

export enum ACCESS_NAME {
  REDIS = 'REDIS',
  RABBITMQ = 'RABBITMQ',
  MQTT = 'MQTT',
  SOCKET_IO = 'SOCKET_IO'
}

export const ACCESS_CONFIG = {
  REDIS : {
    password : '',
    host : '',
    scope : '',
    db : '',
    no_ready_check : false
  },
  RABBITMQ : {
    username : '',
    password : '',
    host : ''
  },
  MQTT : {
    username : '',
    password : '',
    host : ''
  },
  SOCKET_IO : {
    username : '',
    password : '',
    host : ''
  }
}

export const BROKER_STATUS = {
  ON : 1,
  OFF : 0
}

export interface BrokerModelInterface extends BaseModelInterface{}

export default BaseModel.extend<BrokerModelInterface>({
  model : Broker
});