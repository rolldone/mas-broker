import BaseModel, { BaseModelInterface } from "@root/base/BaseModel";
import Adapter from "@root/sequelize/models/Adapter";

export const ADAPTER_AS_CLIENT = 1
export const ADAPTER_AS_SERVER = 2

export enum ADAPTER_TYPE {
  /* As Client */
  REDIS = ADAPTER_AS_CLIENT,
  RABBITMQ = ADAPTER_AS_CLIENT,
  MQTT = ADAPTER_AS_CLIENT,
  SOCKET_IO = ADAPTER_AS_CLIENT,
  /* As server */
  SOCKET_IO_SERVER = ADAPTER_AS_SERVER,
  WEB_SOCKET_SERVER = ADAPTER_AS_SERVER
}

export enum ACCESS_NAME {
  REDIS = 'REDIS',
  RABBITMQ = 'RABBITMQ',
  MQTT = 'MQTT',
  SOCKET_IO = 'SOCKET_IO',
  SOCKET_IO_SERVER = 'SOCKET_IO_SERVER',
  WEB_SOCKET_SERVER = 'WEB_SOCKET_SERVER'
}

export const ACCESS_CONFIG = {
  REDIS: {
    password: '',
    host: '',
    scope: '',
    db: '',
    no_ready_check: false,
    port: 6379
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

export const ADAPTER_STATUS = {
  ON: 1,
  OFF: 0
}

export interface AdapterModelInterface extends BaseModelInterface { }

export default BaseModel.extend<AdapterModelInterface>({
  model: Adapter
});