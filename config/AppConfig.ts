import DotEnv from "../tool/DotEnv";

export interface AppConfigInterface{
  APP_SECRET : string
  APP_PROTOCOL : String
  APP_ENV : String
  APP_DOMAIN : String
  ROOT_DOMAIN : String
  PORT : Number
  COOKIE_DOMAIN : String
  WEB_APP_VER : String
  APP_THREAD_PROCESS : Number
  SOCKET_DOMAIN : String
  BASE_SOCKET_PATH : string
  BASE_SOCKET_IO_PATH : string
}

export default ({
  APP_SECRET : DotEnv.APP_SECRET,
  APP_PROTOCOL : DotEnv.APP_PROTOCOL,
  APP_ENV : DotEnv.APP_ENV,
  APP_DOMAIN : DotEnv.APP_DOMAIN,
  ROOT_DOMAIN : DotEnv.ROOT_DOMAIN,
  PORT : Number(DotEnv.PORT),
  COOKIE_DOMAIN : DotEnv.COOKIE_DOMAIN,
  WEB_APP_VER : DotEnv.WEB_APP_VER,
  SOCKET_DOMAIN : DotEnv.SOCKET_DOMAIN,
  APP_THREAD_PROCESS : Number(DotEnv.APP_THREAD_PROCESS),
  BASE_SOCKET_PATH : DotEnv.BASE_SOCKET_PATH || 'socket',
  BASE_SOCKET_IO_PATH : DotEnv.BASE_SOCKET_IO_PATH || 'socket-io'
} as AppConfigInterface);