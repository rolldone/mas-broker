import BaseModel, { BaseModelInterface } from "@root/base/BaseModel";
import { AdapterEvent, Group, User } from "@root/models";
import Adapter from "@root/models/Adapter";

Adapter.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

Adapter.belongsTo(Group, {
  foreignKey: 'group_id',
  as: 'group'
})

Adapter.hasMany(AdapterEvent, {
  foreignKey: 'adapter_id',
  as: 'adapter_events'
})

export enum ACCESS_NAME {
  REDIS = 'REDIS',
  RABBITMQ = 'RABBITMQ',
  MQTT = 'MQTT',
  SOCKET_IO = 'SOCKET_IO'
}

export const ACCESS_CONFIG = {
  REDIS: {
    password: '',
    host: '',
    scope: '',
    db: '',
    no_ready_check: false
  },
  RABBITMQ: {
    username: '',
    password: '',
    host: ''
  },
  MQTT: {
    username: '',
    password: '',
    host: ''
  },
  SOCKET_IO_CLIENT: {
    username: '',
    password: '',
    host: ''
  },
  SOCKET_IO_SERVER: {},
  WEB_SOCKET_SERVER: {}
}

export const BROKER_STATUS = {
  ON: 1,
  OFF: 0
}

export interface AdapterModelInterface extends BaseModelInterface { }

export default BaseModel.extend<AdapterModelInterface>({
  model: Adapter
});